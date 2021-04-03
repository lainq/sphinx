import { GuildMember, Message } from 'discord.js'
import { SphinxException } from '../error';

export class SphinxKickCommand {
    private message:Message;
    private mentionCount:any

    /**
     * @constructor
     * 
     * @param {Message} message The message class to reply
     */
    constructor(message:Message) {
        this.message = message
        this.mentionCount = this.message.mentions.members?.size
    }

    /**
     * @public
     * 
     * Checks for mentions in the message, if the bot
     * finds mentions and if the author has permissions 
     * to kick members, loop throught each mention
     * and try kicking the user
     * 
     * If error occurs, throw SphinxException(s)
     * 
     * @returns {void}
     */
    public kickMember = () => {
        if(this.mentionCount > 0){
            const kickMembers = this.message.mentions.members
            this.messageAnimation()
            if(!this.message.member?.hasPermission("KICK_MEMBERS")){
                const exception = new SphinxException(
                    "You don't have permissions to kick anyone",
                    this.message
                ).evokeSphinxException()
                return null
            }
            kickMembers?.every((value:GuildMember) => {
                try{
                    value.kick("Just for fun").then((member:GuildMember) => {
                    }).catch((error) => {
                        const exception = new SphinxException(
                            `I don't have permissions to kick ${value.displayName}`,
                            this.message
                        ).evokeSphinxException()
                    })
                } catch(error) {
                    const exception = new SphinxException(
                        `I do not have permissions to kick ${value.displayName}`,
                        this.message
                    ).evokeSphinxException()
                }
                return true
            })
        } else {
            const exception = new SphinxException(
                "Whome should I kick?",
                this.message
            ).evokeSphinxException()
        }
    }

    /**
     * @private
     * 
     * Sends a message and edit it to
     * form a countdown animation while
     * the members are being kicked
     * 
     * @returns {void}
     */
    private messageAnimation = () => {
        this.message.channel.send("Kicking members")
        this.message.channel.send(":three:").then((message:Message) => {
            setTimeout(() => {
                message.edit(":two:").then((messageData:Message) => {
                    setTimeout(() => {
                        messageData.edit(":one:").then((data:Message) => {
                            data.edit(":zero:").then((message:Message) => {
                                setTimeout(() => {
                                    message.delete()
                                }, 200)
                            })
                        })
                    }, 200)
                })
            }, 200)
        })
    }
}
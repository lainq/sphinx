import { GuildMember, Message } from 'discord.js'
import { SphinxException } from '../error';

export class SphinxKickCommand {
    private message:Message;
    private mentionCount:any

    constructor(message:Message) {
        this.message = message
        this.mentionCount = this.message.mentions.members?.size
    }

    public kickMember = () => {
        if(this.mentionCount > 0){
            const kickMembers = this.message.mentions.members
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
                        this.message.channel.send(`Kicked ${member.displayName}`)
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
}
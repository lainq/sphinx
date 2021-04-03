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
            kickMembers?.every((value:GuildMember) => {
                console.log(value)
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
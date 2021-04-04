import { Guild, GuildMember, Message, User } from "discord.js";

class SphinxDuplicateMessage {
    private message:Message
    private author:GuildMember | undefined | User
    private server:Guild | null

    constructor(message:Message) {
        this.message = message
        this.server = this.message.guild
        this.author = this.server == null ? this.message.author : this.server.members.cache.filter(
            (value:GuildMember) => {
                return value.user.username == this.message.author.username
            }
        ).first()

        console.log(this.author)
    }
}

export const isDuplicateMessage = (message:Message):Boolean => {
    const checkDuplicateMessage = new SphinxDuplicateMessage(message)
    return false   
}


import { Collection, Message, Role, User } from "discord.js";

export class SphinxRoleAssignment {
    private message:Message
    private author:User;
    private mentions:Collection<string, User>
    private roles:Collection<string, Role>

    constructor(message:Message) {
        this.message = message
        this.author = this.message.author
        this.mentions = this.message.mentions.users
        this.roles = this.message.mentions.roles

        console.log(this.roles)
    }
}
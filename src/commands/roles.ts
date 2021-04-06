import { Client, Collection, GuildMember, Message, Role, User } from "discord.js";
import { SphinxException } from "../error";

export class SphinxRoleAssignment {
    private message:Message
    private author:GuildMember | undefined;
    private mentions:Collection<string, User>
    private roles:Collection<string, Role>
    private client:GuildMember | undefined

    constructor(message:Message, client:Client) {
        this.message = message
        this.author = this.message.guild?.members.cache.filter((member:GuildMember) => {
            return member.id == this.message.author.id && member.user.username == this.message.author.username
        }).first()
        this.mentions = this.message.mentions.users
        this.roles = this.message.mentions.roles
        this.client = this.message.guild?.members.cache.filter((member:GuildMember) => {
            return member.id == client.user?.id
        }).first()

        this.addUserRoles()
    }

    public addUserRoles = ():void | null => {
        if(!this.verifyCommandParameters() || this.message.guild == null){
            return null
        }
        if(!this.author?.hasPermission("MANAGE_ROLES")){
            this.throwRoleException("You do not permission to manage roles")
            return null
        } else if(!this.client?.hasPermission("MANAGE_ROLES")){
            this.throwRoleException("I don't have permission to manage roles :slight_frown:")
            return null
        }

        console.log("Suggess")
    }

    private throwRoleException = (exceptionMessage:string):SphinxException => {
        const exception = new SphinxException(exceptionMessage, this.message)
        exception.evokeSphinxException()

        return exception
    }

    private verifyCommandParameters = ():boolean => {
        if(this.mentions.size != 1 || this.roles.size != 1){
            const exception = new SphinxException(
                "Invalid parameters. Parameters:[role, user]",
                this.message
            ).evokeSphinxException()
            return false
        }
        return true
    }
}
import { Client, Collection, Guild, GuildMember, Message, Role, User } from "discord.js";
import { SphinxException } from "../error";
import { getUserDisplayName } from "./server";

export class SphinxRoleAssignment {
    private message:Message
    private author:GuildMember | undefined;
    private mentions:Collection<string, User>
    private roles:Collection<string, Role>
    private client:GuildMember | undefined

    /**
     * @constructor
     * 
     * @param message The message class
     * @param client The client object
     */
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

    /**
     * @public
     * 
     * Verify the parameters passed in along with
     * the command and assign roles to specific
     * users
     * 
     * @returns {void | null}
     */
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

        this.message.guild.members.cache.filter((member:GuildMember) => {
            return member.id == this.mentions.first()?.id
        }).forEach((member:GuildMember) => {
            this.roles.forEach((role:Role) => {
                member.roles.add(role).then((value:GuildMember) => {
                    this.message.channel.send(`Assigned role to ${getUserDisplayName(value)}`)
                })
            })
        })
    }

    /**
     * @private
     * 
     * Throws an exception message
     * 
     * @param exceptionMessage The exception message
     * @returns {SphinxException}
     */
    private throwRoleException = (exceptionMessage:string):SphinxException => {
        const exception = new SphinxException(exceptionMessage, this.message)
        exception.evokeSphinxException()

        return exception
    }

    /**
     * @private
     * 
     * Verify the size of the user mentions and
     * the role mentions to continue to assign
     * roles
     * 
     * @returns {boolean}
     */
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
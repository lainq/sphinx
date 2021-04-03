import { Channel, Guild, GuildMember, Message, MessageEmbed, Role } from "discord.js";
import { image } from "../../index";

export const serverInformation = (server:Guild, message:Message) => {
    const channelCount = (serverData:Guild, types:Array<string>):number => {
        return serverData.channels.cache.filter((channel:Channel) => {
            return types.includes(channel.type)
        }).size
    }
    const embed = new MessageEmbed()
      .setAuthor(server.name, server.iconURL()?.toString())
      .addField(":id: Server ID", server.id, true)
      .addField(":calendar: Created on", server.createdAt.toDateString(), true)
      .addField(":crown: Owned by", server.owner?.nickname == null ? server.owner?.displayName : server.owner?.nickname, true)
      .addField(
        `:busts_in_silhouette: Members(${server.memberCount})`,
        server.members.cache.filter((member:GuildMember) => {
            return member.presence.status == "online"
        }).size + " online",
        true
      )
      .addField(
          `:speech_balloon: ${channelCount(server, ["text", "voice"])}`,
          `**${channelCount(server, ["text"])}** text | ${channelCount(server, ["voice"])} voice`,
          true
      )
      .addField(
          `:earth_africa: Others`,
          `**Region**:${server.region.charAt(0).toUpperCase() + server.region.slice(1)}`,
          true
      )
    console.log(server)
    message.channel.send(embed)
}

const getMemberCount = (message:Message, role:Role | undefined):number => {
    if(role == undefined){
        return 0;
    }
    const roleUserCount = message.guild?.members.cache.filter((member:GuildMember) => {
        return Array.from(member.roles.cache.keys()).includes(role.id)
    }).size
    if(roleUserCount == undefined){
        return 0
    }
    return roleUserCount;
}

export const serverRoleInformation = (server:Guild, message:Message) => {
    const getSpaces = (length:number | undefined):string => {
        if(length == undefined){
            return ""
        }

        let spacedString = ""
        for(let index=0; index<(21-length); index++){
            spacedString += " "
        }
        return spacedString
    }

    const roles = server.roles.cache
    let messageData:string = ``
    const keys = Array.from(roles.keys())
    for(let keyIndex=0; keyIndex<keys.length; keyIndex++){
        const currentRole = roles.get(keys[keyIndex])
        messageData += `${currentRole?.name}${getSpaces(currentRole?.name.toString().length)}\n`
        console.log(getMemberCount(message, currentRole))
    }
    message.channel.send(messageData)
}
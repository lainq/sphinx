import { Channel, Guild, GuildMember, Message, MessageEmbed } from "discord.js";
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
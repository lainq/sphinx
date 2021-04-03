import { MessageEmbed } from "discord.js";

export interface SphinxEmbedProperties {
    title : string
    author : any
    color : string
    description : string
    thumbnail : string
    url : string
}

export const createDiscordEmbed = (properties:SphinxEmbedProperties):MessageEmbed => {
    const embed = new MessageEmbed()
      .setTitle(properties.title)
      .setAuthor(properties.author.name, properties.author.image)
      .setColor(properties.color)
      .setDescription(properties.description)
      .setThumbnail(properties.thumbnail)
      .setTimestamp()
      .setURL(properties.url);
    return embed
}
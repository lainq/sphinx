import {MessageEmbed} from 'discord.js';

export interface SphinxEmbedProperties {
  // the title of the embed
  title: string;

  // the author of the embed with two properties
  // name{The name of the author} and image{the avatar url}
  author: any;

  // color of the embed message
  color: string;

  // description of the message
  description: string;

  // thumbnail image of the embed message
  thumbnail: string;
  url: string;
}

/**
 * Creates a discord embed message according to the
 * properties passed in as parameters and return
 * the new embed
 *
 * @param {SphinxEmbedProperties} properties The properties of the embed
 * @returns {MessageEmbed} A new discord embed message
 */
export const createDiscordEmbed = (
  properties: SphinxEmbedProperties
): MessageEmbed => {
  const embed = new MessageEmbed()
    .setTitle(properties.title)
    .setAuthor(properties.author.name, properties.author.image)
    .setColor(properties.color)
    .setDescription(properties.description)
    .setThumbnail(properties.thumbnail)
    .setTimestamp()
    .setURL(properties.url);
  return embed;
};

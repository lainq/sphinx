import {
  Channel,
  Guild,
  GuildMember,
  Message,
  MessageEmbed,
  Role,
  User,
} from 'discord.js';
import {image} from '../../index';

/**
 * Get all the channels in the server
 * and filter it by specific channel type.then
 * returns the size of the final array
 * of channels
 *
 * @param {Guild} serverData The guild
 * @param {string[]} types The type of channels to count
 * @returns {number} The number of specified channel
 */
export const channelCount = (
  serverData: Guild,
  types: Array<string>
): number => {
  return serverData.channels.cache.filter((channel: Channel) => {
    return types.includes(channel.type);
  }).size;
};

/**
 * Gets information about the server
 * and sends a message as an embed
 *
 * @param {Guild} server The discord server
 * @param {Message} message The message class
 */
export const serverInformation = (server: Guild, message: Message) => {
  const embed = new MessageEmbed()
    .setAuthor(server.name, server.iconURL()?.toString())
    .addField(':id: Server ID', server.id, true)
    .addField(':calendar: Created on', server.createdAt.toDateString(), true)
    .addField(
      ':crown: Owned by',
      server.owner?.nickname == null
        ? server.owner?.displayName
        : server.owner?.nickname,
      true
    )
    .addField(
      `:busts_in_silhouette: Members(${server.memberCount})`,
      server.members.cache.filter((member: GuildMember) => {
        return member.presence.status == 'online';
      }).size + ' online',
      true
    )
    .addField(
      `:speech_balloon: ${channelCount(server, ['text', 'voice'])}`,
      `**${channelCount(server, ['text'])}** text | ${channelCount(server, [
        'voice',
      ])} voice`,
      true
    )
    .addField(
      `:earth_africa: Others`,
      `**Region**:${
        server.region.charAt(0).toUpperCase() + server.region.slice(1)
      }`,
      true
    );
  message.channel.send(embed);
};

/**
 * Gets the list of members and returns the
 * number of members with a speicific role
 *
 * @param {Message} message The message content
 * @param {Role} role The role to check the member count
 * @returns {number} The number of members with the specific role
 */
const getMemberCount = (message: Message, role: Role | undefined): number => {
  if (role == undefined) {
    return 0;
  }
  const roleUserCount = message.guild?.members.cache.filter(
    (member: GuildMember) => {
      return Array.from(member.roles.cache.keys()).includes(role.id);
    }
  ).size;
  if (roleUserCount == undefined) {
    return 0;
  }
  return roleUserCount;
};

/**
 * Get all the roles in the server as the number of
 * members with the specific role and then send
 * the message in the current channel
 *
 * @param {Guild} server The discord server
 * @param {Message} message The message class
 */
export const serverRoleInformation = (server: Guild, message: Message) => {
  const getSpaces = (length: number | undefined): string => {
    if (length == undefined) {
      return '';
    }

    let spacedString = '';
    for (let index = 0; index < 21 - length; index++) {
      spacedString += ' ';
    }
    return spacedString;
  };

  const roles = server.roles.cache;
  let messageData: string = ``;
  const keys = Array.from(roles.keys());
  for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
    const currentRole = roles.get(keys[keyIndex]);
    messageData += `${currentRole?.name}${getSpaces(
      currentRole?.name.toString().length
    )}${getMemberCount(message, currentRole)}\n`;
  }
  messageData = '```' + messageData + '```';
  message.channel.send(messageData);
};

/**
 * Gets the user avatar and return the default image
 * if the avatar url is null, else return the
 * avatar url
 */
export const getUserAvatar = (user: User): string => {
  const url = user.avatarURL();
  return url == null ? image : url;
};


export const getUserDisplayName = (value:GuildMember | undefined):string => {
  if(value == null){
    return ""
  }
  const name:string | null = value.nickname
  if(name == null){
    return value.displayName
  }
  return name
}
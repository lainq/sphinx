import {Channel, Client} from 'discord.js';

/**
 * @constant
 *
 * Find a channel in the guild by a
 * specific id :slight_smile:
 *
 * @param channelId The id of the channel to search by
 * @param client The client
 * @returns The channel
 */
export const findChannelId = (channelId: string, client: Client) => {
  const channels = client.channels.cache;
  const findChannel = channels.find((value: Channel) => {
    return value.id == channelId;
  });
  return findChannel;
};

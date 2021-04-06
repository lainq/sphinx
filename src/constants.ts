import {Client, Message, User} from 'discord.js';

/**
 * Regional Indictor emoji unicodes
 * for reacting to the polls
 */
export const regionalIndicators = Object.values({
  ':regional_indicator_a:': '🇦',
  ':regional_indicator_b:': '🇧',
  ':regional_indicator_c:': '🇨',
  ':regional_indicator_d:': '🇩',
  ':regional_indicator_e:': '🇪',
  ':regional_indicator_f:': '🇫',
  ':regional_indicator_g:': '🇬',
  ':regional_indicator_h:': '🇭',
  ':regional_indicator_i:': '🇮',
  ':regional_indicator_j:': '🇯',
  ':regional_indicator_k:': '🇰',
  ':regional_indicator_l:': '🇱',
  ':regional_indicator_m:': '🇲',
  ':regional_indicator_n:': '🇳',
  ':regional_indicator_o:': '🇴',
  ':regional_indicator_p:': '🇵',
  ':regional_indicator_q:': '🇶',
  ':regional_indicator_r:': '🇷',
  ':regional_indicator_s:': '🇸',
  ':regional_indicator_t:': '🇹',
  ':regional_indicator_u:': '🇺',
  ':regional_indicator_v:': '🇻',
  ':regional_indicator_w:': '🇼',
  ':regional_indicator_x:': '🇽',
  ':regional_indicator_y:': '🇾',
  ':regional_indicator_z:': '🇿',
});

/**
 * Checks if the bot is mentioned in the message
 *
 * @param {Message} message The message class
 * @param {Client} client The client object
 * @returns {boolean}
 */
export const botMentioned = (message: Message, client: Client): boolean => {
  const mentions = message.mentions.users.filter((member: User) => {
    return member.id == client.user?.id;
  });
  return mentions.size > 0;
};

import {Message} from 'discord.js';

/**
 * If the message is a direct message, return null
 * else, trim the question, split it by spaces
 * and remove the `!poll` keyword from the array
 * and join the string with a space(" ") as the
 * separator
 *
 * Send a message in the channel and react to the
 * message with a thumbs_up and a thumbs_down
 *
 * @param {Message} message The message class
 * @returns {void}
 */
export const sphinxSimplePoll = (message: Message) => {
  if (message.guild == null) {
    return null;
  }

  let question:
    | string
    | Array<string> = message.content.toString().trim().split(' ');
  question = question.slice(1, question.length).join(' ');

  if (question.length == 0) {
    return null;
  }

  const name = `${message.author.username}${message.author.discriminator}`;
  message.channel
    .send(`**${name}** asks: ${question}`)
    .then((data: Message) => {
      data.react('👍');
      data.react('👎');
    })
    .catch(console.error);

  message.delete();
};


export class SphinxPollCommand {
  private message:Message

  constructor(message:Message) {
    this.message = message
  }
}
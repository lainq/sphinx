import {Message} from 'discord.js';
import {SphinxException} from '../error';

interface PollCommand {
  // the poll question
  question: string;
  // the choices
  choices: Array<string>;
}

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
  private message: Message;
  private position: number = 0;

  /**
   * @constructor
   * @param {Message} message The message object
   */
  constructor(message: Message) {
    this.message = message;

    this.createSphinxPoll();
  }

  /**
   * @public
   *
   * Tokenises the message,validates the parameters
   * and create the poll.
   *
   * For each time a quotation is encountered in pairs
   * a new token is added which is later converted
   * to the PollCommand type
   *
   * @returns {void | null}
   */
  public createSphinxPoll = (): void | null => {
    let parameters: string | Array<string> = this.message.content.split(' ');
    parameters = parameters.slice(1, parameters.length).join(' ');

    let tokens: Array<string> = [];
    let quotationCount = 0;
    let currentString = '';

    let character = this.currentCharacter(parameters);
    while (character != null) {
      if (character == '"') {
        quotationCount += 1;
      }

      if (quotationCount % 2 == 0) {
        tokens.push(currentString);
        currentString = '';
      }
      currentString += character;

      this.position += 1;
      character = this.currentCharacter(parameters);
    }

    const formattedTokens = this.formatTokenArray(tokens);
    if (!this.verifyTokenData(formattedTokens)) {
      console.log('error');
      return null;
    }
  };

  /**
   * @private
   *
   * @param {string}
   * @returns {void}
   */
  private raisePollException = (message: string): void => {
    const error = new SphinxException(message, this.message);
    error.evokeSphinxException();
  };

  /**
   * @private
   *
   * Verify the poll command based on
   * certain criteria(s)
   *
   * @param tokens The poll command
   * @returns {boolean} if the poll command passes
   * all the conditions
   */
  private verifyTokenData = (tokens: PollCommand): boolean => {
    if (tokens.question == undefined) {
      this.raisePollException('Question not provided with the poll');
      return false;
    } else if (tokens.question.trim().length == 0) {
      this.raisePollException('Question is empty');
      return false;
    } else if (tokens.choices.length < 2 || tokens.choices.length > 26) {
      this.raisePollException(
        'The number of choices should be between 2 and 26'
      );
      return false;
    } else {
      for (let idx = 0; idx < tokens.choices.length; idx++) {
        const choice = tokens.choices[idx].slice(1, tokens.choices[idx].length);
        if (choice.trim().length == 0) {
          console.log(idx);
          this.raisePollException('Choices cannot be empty');
          return false;
        }
        tokens.choices[idx] = choice;
      }
    }
    return true;
  };

  /**
   * @private
   *
   * Remove odd indexes from the array and slice
   * the first character of all array elements
   *
   * @param {Array<string>} tokens The token array
   * @returns {PollCommand} The newly created poll commands
   */
  private formatTokenArray = (tokens: Array<string>): PollCommand => {
    let returnArray: Array<string> = [];
    for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
      if (tokenIndex % 2 == 0) {
        let value = tokens[tokenIndex];
        returnArray.push(value.slice(1, value.length));
      }
    }

    return {
      question: returnArray[0],
      choices: returnArray.slice(1, returnArray.length),
    };
  };

  /**
   * @private
   *
   * Returns the current character to tokenise
   * based on the position property
   *
   * If the position is equal to the length of
   * the string, return null
   * else, return the character at the current position
   * of the string
   *
   * @param {string} data The string data
   * @returns {null | string} The current character
   */
  private currentCharacter = (data: string): null | string => {
    if (data.length == this.position) {
      return null;
    } else {
      return data[this.position];
    }
  };
}

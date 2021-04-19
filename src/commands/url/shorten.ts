import axios, {AxiosResponse} from 'axios';
import {Message, MessageEmbed} from 'discord.js';
import {randomColor} from '../../embed';
import {SphinxException} from '../../error';

export class SphinxUrlShortener {
  /**
   * Returns the main api endpoint
   * @returns {string} the static url
   */
  private static readonly url = (): string => {
    return 'https://api.rebrandly.com/v1/links';
  };

  private message: Message;
  private messageContent: string;

  /**
   * @constructor
   * @param {Message} message The message class
   */
  constructor(message: Message) {
    this.message = message;
    this.messageContent = this.message.content;

    let url: string | null = this.createUrl(this.messageContent);
    if (url != null) {
      this.shorten(url);
    }
  }

  /**
   * @private
   *
   * Capture the url from the message
   *
   * @param {string} message The message content
   * @returns {string} the captured url
   */
  private createUrl = (message: string): string | null => {
    const messageArray: Array<string> = SphinxUrlShortener.removeFromArray(
      message.split(' '),
      ['']
    );
    if (messageArray.length > 1) {
      return messageArray[1];
    }
    return null;
  };

  /**
   * @public
   * @static
   *
   * Remove a specific list of elements from
   * an array and return the array
   *
   * @param {Array<any>} array The array to remove element from
   * @param {Array<any>} character The array of members that should be removed
   * @returns {Array<any>} The filtered array
   */
  public static removeFromArray = (
    array: Array<any>,
    character: Array<any>
  ) => {
    let returnValue: Array<any> = new Array();
    for (let index = 0; index < array.length; index++) {
      if (!character.includes(array[index])) {
        returnValue.push(array[index]);
      }
    }
    return returnValue;
  };

  /**
   * @private
   *
   * Shorten the url by sending requests
   * to the rebrand  api
   *
   * @param {string} url The url to shorten
   * @returns {void}
   */
  private shorten = (url: string): void => {
    axios({
      method: 'post',
      url: SphinxUrlShortener.url(),
      data: JSON.stringify({
        destination: url,
        domain: {fullName: 'rebrand.ly'},
      }),
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.URL,
      },
    })
      .then((response: AxiosResponse<any>) => {
        const data = response.data.shortUrl;
        const embed = new MessageEmbed();
        embed.setTitle(data);
        embed.setURL(`https://${data}`);
        embed.setDescription(`
              :link: Here is your shortened url :slight_smile:, ${data}
              `);
        embed.setColor(randomColor());
        this.message.channel.send(embed).then((messageData: Message) => {
          messageData.react('🔗');
        });
      })
      .catch((error: any) => {
        const ezception = new SphinxException(
          'Failed to shorten your link :frowning:',
          this.message
        ).evokeSphinxException();
      });
  };
}

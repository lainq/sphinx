import {Message} from 'discord.js';
import * as axios from 'axios';
import {SphinxException} from './error';
import {createDiscordEmbed} from './embed';
import {image} from '../index';

export class SphinxGithubCommand {
  private message: Message;
  private username: string;

  private url: any = (username: string) => {
    return `https://api.github.com/users/${username}`;
  };

  /**
   * @constructor
   * @param {string} username The github username to fetch data
   * from the api
   * @param {Message} message The message class
   */
  constructor(username: string, message: Message) {
    this.message = message;
    this.username = username;
  }

  /**
   * Fetch information from the github api
   * and create an embed with the user information
   *
   * Send the embed message in the message channel
   */
  public fetchUserData = () => {
    axios.default
      .get(this.url(this.username))
      .then((value: any) => {
        const data = value.data;
        const embed = createDiscordEmbed({
          title: data.name != null ? data.name : this.username,
          author: {
            name: 'Code Roller',
            image: image,
          },
          color: '#2988F6',
          description: data.bio != null ? data.bio : '',
          thumbnail: data.avatar_url,
          url: data.html_url,
        })
          .addField('Repos', data.public_repos, true)
          .addField('Gists', data.public_gists, true)
          .addField('Followers', data.followers, true)
          .addField('Following', data.following, true);
        this.message.channel.send(embed);
      })
      .catch((exception) => {
        const error = new SphinxException(
          'Failed to fetch data about the user',
          this.message
        ).evokeSphinxException();
      });
  };
}

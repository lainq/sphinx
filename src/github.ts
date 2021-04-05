import {Message, MessageEmbed} from 'discord.js';
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

/**
 * Tekes the message and take the first
 * parameter passed with the command
 *
 * check if the parameter is a valid github
 * repo name, else throw an exception
 *
 * fetch data from the api with axios
 * and display the data in the form
 * of an embed
 *
 * @param message The message class
 */
export const sphinxRepositoryCommand = (message: Message) => {
  const count = (data: string, find: string): number => {
    let numberCount = 0;
    for (let index = 0; index < data.length; index++) {
      if (data[index] == find) {
        numberCount += 1;
      }
    }
    return numberCount;
  };

  const verifyRepoName = (data: string) => {
    return (
      data.includes('/') && count(data, '/') == 1 && data.split('/').length == 2
    );
  };
  let args: string | string[] = message.content.split(' ');
  args = args.slice(1, args.length);
  if (!verifyRepoName(args[0])) {
    const exception = new SphinxException(
      'Invalid repo name',
      message
    ).evokeSphinxException();
  } else {
    const url = (data: string) => {
      return `https://api.github.com/repos/${data}`;
    };
    axios.default
      .get(url(args[0]))
      .then((response: axios.AxiosResponse<any>) => {
        const data = response.data;
        const embed = new MessageEmbed()
          .setColor('#2EA043')
          .setTitle(data.full_name)
          .setDescription(data.description == null ? '' : data.description)
          .setThumbnail(data.owner.avatar_url)
          .setURL(data.html_url)
          .addFields([
            {name: ':star: Stars', inline: true, value: data.stargazers_count},
            {name: ':eyes: Watchers', inline: true, value: data.watchers_count},
            {
              name: ':diamonds: Issues',
              inline: true,
              value: data.open_issues_count,
            },
            {name: ':fork_and_knife: Forks', inline: true, value: data.forks},
            {
              name: 'Language',
              inline: true,
              value: data.language == null ? 'Unknown' : data.language,
            },
          ]);

        message.channel.send(embed);
      })
      .catch((error) => {
        console.log(error);
        const err = new SphinxException(
          'An error occured while fetching data for you',
          message
        ).evokeSphinxException();
      });
  }
};

import {config, parse} from 'dotenv';
import {
  Client,
  Collection,
  Guild,
  GuildEmojiManager,
  GuildMember,
  Message,
  MessageEmbed,
  TextChannel,
  User,
} from 'discord.js';
import {Fcal, FcalError} from 'fcal';
import {SphinxException} from './src/error';
import {findChannelId} from './src/channel';
import {SphinxCodeRunner} from './src/run/run';
import {SphinxKickCommand} from './src/commands/kick';
import {createDiscordEmbed} from './src/embed';
import {SphinxGithubCommand, sphinxRepositoryCommand} from './src/github';
import {
  getUserAvatar,
  getUserDisplayName,
  serverInformation,
  serverRoleInformation,
} from './src/commands/server';
import {SphinxUserProfile} from './src/commands/profile';
import {isDuplicateMessage} from './src/duplicate';
import axios, {AxiosResponse} from 'axios';
import {SphinxPollCommand, sphinxSimplePoll} from './src/commands/poll';
import {SphinxRoleAssignment} from './src/commands/roles';
import {botMentioned} from './src/constants';
import {createBotReply} from './src/reply';

// Take all the variables from the env
// file to process.env
config();

// constants
const token = process.env.TOKEN;
const prefix: Array<string> = [
  '=',
  '!',
  ';run',
  'sphinx',
  'github',
  '%',
  'repo',
  '$',
];
export const image = 'http://i.imgur.com/p2qNFag.png';

let speak = false;
// the discord clinet
const client = new Client({ws: {intents: ['GUILD_MESSAGES', 'GUILDS']}});

/**
 * Checks whether the  message is a commandor not
 *
 * @param {String} message The message content to check if a command
 * @returns An object with type and command
 */
const isBotCommand = (message: string): any => {
  for (let index = 0; index < prefix.length; index++) {
    if (message.toLowerCase().startsWith(prefix[index])) {
      return {
        type: prefix[index],
        command: true,
      };
    }
  }
  return {type: null, command: false};
};

/**
 * Fetch random cat images from the catapi
 * and send in the channel
 *
 * @param message The message class
 */
const generateCatImages = (message: Message): void => {
  axios
    .get('https://api.thecatapi.com/v1/images/search')
    .then((data: AxiosResponse<any>) => {
      const value: Array<any> = Array.from(data.data);
      for (let imgIndex = 0; imgIndex < value.length; imgIndex++) {
        message.channel.send(value[imgIndex].url);
      }
    })
    .catch((exception) => {
      const error = new SphinxException(
        'Failed to fetch cat images',
        message
      ).evokeSphinxException();
    });
};

/**
 * Fetch some random activities using axios
 * and send them as embeds
 *
 * @param message The message class
 */
const generateActivities = (message: Message): void => {
  axios
    .get('http://www.boredapi.com/api/activity/')
    .then((data: AxiosResponse<any>) => {
      const value = data.data;
      const embed = createDiscordEmbed({
        title: `:busts_in_silhouette: ${value.activity}`,
        author: {name: 'Sphinx', image: image},
        description: '',
        color: '#7289DA',
        url: value.link,
        thumbnail: '',
      })
        .addField(':small_blue_diamond: Type', value.type, true)
        .addField(
          ':man_construction_worker::woman_construction_worker: Participants',
          value.participants,
          true
        )
        .addField(':moneybag: Price', value.price);
      message.channel.send(embed);
    })
    .catch((err) => {
      const error = new SphinxException(
        'Nothing for you right now',
        message
      ).evokeSphinxException();
    });
};

/**
 * Take the last message sent in the server
 * before the current message and then react to
 * the message with a random emoji
 *
 * @param {Message} message The message class
 */
export const reactToMessage = (message: Message) => {
  let reactList = [
    '😉',
    '😟',
    '🙂',
    '😀',
    '😐',
    '😏',
    '😌',
    '😵',
    '😕',
    '☹️',
    '☹️',
  ];
  const reactMessage = message.author.lastMessageID;
  if (reactMessage != null) {
    message.channel.messages
      .fetch({limit: 2})
      .then((data: any) => {
        const reactMessageObject = data.array()[1];
        let reactEmoji =
          reactList[Math.floor(Math.random() * reactList.length)];
        if (reactEmoji == undefined) {
          reactEmoji = reactList[0];
        }
        reactMessageObject.react(reactEmoji);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
interface BadWords {
  // the message that contains bad word
  word: string | null;

  // the bad word present in the message
  badWord: string | null;
  contains: boolean;
}

/**
 * Checks if the message contains any bad
 * words, if yes return true, else false
 *
 * @param {string} message The message
 * @returns {BadWords}
 */
const hasBadWors = (message: string): BadWords => {
  const badWords: Array<string> = ['fuck', 'dumbass', 'ass', 'sex'];
  const searchMessageArray = message.split(' ');
  for (
    let searchIndex = 0;
    searchIndex < searchMessageArray.length;
    searchIndex++
  ) {
    const currentMessage = searchMessageArray[searchIndex];
    for (let idx = 0; idx < badWords.length; idx++) {
      if (currentMessage.includes(badWords[idx])) {
        return {
          word: '`' + message + '`',
          badWord: badWords[idx],
          contains: true,
        };
      }
    }
  }
  return {word: null, badWord: null, contains: false};
};

/**
 * Send a slight_smile message, edit the message
 * to a wink and then back to slight_smile after
 * a specific timeout
 *
 * @param {Message} message The message class that is sent when
 * the `sphinx` prefix is used in a message
 */
const sphinxMessage = (message: Message) => {
  message.channel.send(':slight_smile:').then((messageData) => {
    setTimeout(() => {
      messageData.edit(':wink:').then((editMessage) => {
        setTimeout(() => {
          editMessage.edit(':slight_smile:');
        }, 200);
      });
    }, 500);
  });
};

client.on('ready', () => {
  console.log('The bot has started');
});

client.on('message', async (message: Message) => {
  if (message.author.bot) {
    return null;
  }

  const command: any = isBotCommand(message.content);
  const bad = hasBadWors(message.content);
  if (command.command) {
    if (command.type == '=') {
      const calculations = message.content.slice(1, message.content.length);
      try {
        const data = Fcal.eval(calculations);
        message.reply(data.toString());
      } catch (exception) {
        if (exception instanceof FcalError) {
          const error = new SphinxException(
            'An error occured while parsing your message :frowning:',
            message
          );
          error.evokeSphinxException();
        }
      }
    } else if (command.type == 'sphinx') {
      if (bad.contains) {
        const warning = createDiscordEmbed({
          title: `Don't use bad words in the ${message.guild?.name} server`,
          author: {
            name: 'Code Roller',
            image: image,
          },
          color: '#e20202',
          description: `
          ${bad.badWord} found in a message
          `,
          thumbnail: image,
          url: '',
        });
        message.author.send(warning);
        message.channel.send(warning);
        message.delete();
      } else {
        const dataLength = message.content.split(' ').length - 1;
        if (dataLength > 0) {
          let question: string | Array<string> = message.content.split(' ');
          question = question.slice(1, question.length).join(' ');
          createBotReply(message, question);
        } else {
          sphinxMessage(message);
        }
      }
    } else if (command.type == ';run') {
      const executor = new SphinxCodeRunner(message);
    } else if (command.type == '!') {
      const sphinxCommand = message.content
        .slice(1, message.content.length)
        .split(' ');
      if (sphinxCommand[0] == 'kick') {
        const kick = new SphinxKickCommand(message).kickMember();
      } else if (sphinxCommand[0] == 'clear') {
        // if the command is to clear messages
        // get the argument and validate it
        // to be a number

        // if the argument is valid, try deleting message
        // if an error occurs, throw a sphinxException

        const count = sphinxCommand[1];
        if (Number.isInteger(parseInt(count))) {
          if (parseInt(count) > 100 || parseInt(count) < 1) {
            const error = new SphinxException(
              'The message count should be between 1 and 100',
              message
            ).evokeSphinxException();
          } else {
            await message.channel.messages
              .fetch({limit: parseInt(count)})
              .then((data: any) => {
                // Fetches the messages
                if (message.channel.type == 'text') {
                  message.channel.bulkDelete(data);
                } else {
                  const error = new SphinxException(
                    'An error occured while deleteing messages',
                    message
                  ).evokeSphinxException();
                }
              })
              .catch((errorData) => {
                const error = new SphinxException(
                  'An error occured while deleting message',
                  message
                ).evokeSphinxException();
              });
          }
        } else {
          const error = new SphinxException(
            'Not a valid argument for clear',
            message
          ).evokeSphinxException();
        }
      } else if (sphinxCommand[0] == 'react') {
        reactToMessage(message);
      } else if (sphinxCommand[0] == 'cat') {
        generateCatImages(message);
      } else if (sphinxCommand[0] == 'bored') {
        generateActivities(message);
      } else if (sphinxCommand[0] == 'quickpoll') {
        if (message.guild != null) {
          sphinxSimplePoll(message);
        }
      } else if (sphinxCommand[0] == 'poll') {
        if (message.guild != null) {
          const poll = new SphinxPollCommand(message, client);
        }
      } else if (sphinxCommand[0] == 'count') {
        if (message.guild != null) {
          const data = message.channel.messages.cache.filter(
            (messageData: Message) => {
              return messageData.author == message.author;
            }
          ).size;
          message.reply(
            `You have sent ${data} messages in this channel :slight_smile:`
          );
        }
      } else if (sphinxCommand[0] == 'avatar') {
        const mentions = message.mentions;
        if (mentions.everyone) {
          message.reply("Sorry, you can't mention everyone");
        } else {
          if (message.mentions.users.size > 0) {
            message.mentions.users.forEach((user: User) => {
              const avatar = user.avatarURL();
              message.channel.send(
                avatar == null ? "Sadly, the user doesn't have a dp" : avatar
              );
            });
          } else {
            const avatar = message.author.avatarURL();
            message.channel.send(
              avatar == null ? "Sadly, the user doesn't have a dp" : avatar
            );
          }
        }
      } else if (sphinxCommand[0] == 'channel') {
        let channels = message.mentions.channels;
        if (channels.size == 0) {
          if (message.channel.type == 'text') {
            channels = new Collection<string, TextChannel>([
              [message.channel.id.toString(), message.channel],
            ]);
          }
        }

        channels.forEach((channel: TextChannel) => {
          const lastMessage: string | undefined = channel.messages.cache
            .filter((channel: Message) => {
              return channel.author.bot == false;
            })
            .last()?.content;

          const embed = new MessageEmbed().setColor('#7289DA');
          embed.setTitle(`About #${channel.name}`);
          embed.setAuthor('Sphinx', image);

          embed.addFields([
            {name: ':name_badge: Name', value: channel.name, inline: true},
            {
              name: ':small_blue_diamond: Type',
              value: channel.type,
              inline: true,
            },
            {
              name: ':stop_button: Topic',
              value:
                channel.topic == null
                  ? '**No topic available**'
                  : channel.topic,
              inline: true,
            },
            {
              name: ':speech_balloon: Last Message',
              inline: true,
              value:
                lastMessage == undefined
                  ? '**Idk the what the last message is!!**'
                  : lastMessage,
            },
          ]);

          message.channel.send(embed);
        });
      } else if (sphinxCommand[0] == 'quote') {
        axios
          .get('https://api.quotable.io/random')
          .then((response: AxiosResponse<any>) => {
            const data = response.data;
            const embed = new MessageEmbed()
              .setColor('#9147ff')
              .setDescription(`>>> ${data.content}`)
              .addField(':pencil: Author', data.author, true);
            message.channel.send(embed);
          })
          .catch((err) => {
            const error = new SphinxException(
              'An error occured while fetching quotes for you',
              message
            ).evokeSphinxException();
          });
      }
    } else if (command.type == 'github') {
      const username = message.content.split(' ')[1];
      if (username == undefined) {
        const exception = new SphinxException(
          'Invalid username',
          message
        ).evokeSphinxException();
      } else {
        const userData = new SphinxGithubCommand(
          username,
          message
        ).fetchUserData();
      }
    } else if (command.type == 'repo') {
      sphinxRepositoryCommand(message);
    } else if (command.type == '%') {
      const data = message.content.slice(1, message.content.length).split(' ');
      if (data[0] == 'server' || data[0] == 'serverinfo') {
        if (message.guild != null) {
          serverInformation(message.guild, message);
        }
      } else if (data[0] == 'roles') {
        if (message.guild != null) {
          serverRoleInformation(message.guild, message);
        }
      } else if (data[0] == 'profile') {
        if (message.guild != null) {
          const profile = new SphinxUserProfile(message);
        }
      }
    } else if (command.type == '$') {
      const colonCommand = message.content.split(' ');
      const commandName = colonCommand[0].slice(1, colonCommand[0].length);
      if (commandName == 'role') {
        const role = new SphinxRoleAssignment(message, client);
      }
    }
  } else if (bad.contains) {
    // Check if the message contains
    // any bad words
    const warning = createDiscordEmbed({
      title: `Don't use bad words in the ${message.guild?.name} server`,
      author: {
        name: 'Code Roller',
        image: image,
      },
      color: '#e20202',
      description: `
      ${bad.badWord} found in a message
      `,
      thumbnail: image,
      url: '',
    });
    message.author.send(warning);
    message.channel.send(warning);
    message.delete();
  } else if (
    message.content.includes('https://discord.gg') ||
    message.content.includes('https://discord.com/invite')
  ) {
    // prevents people from advertising servers
    message.author.send(
      createDiscordEmbed({
        title: `Don't advertise servers in ${message.guild?.name}`,
        author: {
          name: 'Code Roller',
          image: image,
        },
        color: '#e20202',
        description: `Advertising not allowed in ${message.guild?.name}`,
        thumbnail: image,
        url: '',
      })
    );
    message.delete();
  } else {
    if (isDuplicateMessage(message)) {
      console.log('Found duplicate message');
    } else if (botMentioned(message, client)) {
      if (message.guild != null) {
        message.channel.send(
          `Why did you ping me ${getUserDisplayName(
            message.guild?.members.cache
              .filter((member: GuildMember) => {
                return member.id == message.author.id;
              })
              .first()
          )} :angry: ??`
        );
      }
    } else {
      console.log(speak);
      if (message.content.toLowerCase().includes('sphinx')) {
        speak = true;
      }

      if (
        message.content.toLowerCase().includes('stop sphinx') ||
        message.content.toLowerCase().includes('sphinx stop')
      ) {
        speak = false;
      }

      if (speak) {
        createBotReply(message, message.content);
      }
    }
  }
});

client.on('guildCreate', (guild: Guild) => {
  const channel = guild.systemChannel;
  channel?.send(
    createDiscordEmbed({
      title: `Thank you for inviting me`,
      author: {
        name: 'Code Roller',
        image: image,
      },
      color: '#7289DA',
      description: `I am the Sphinx bot and thank you for inviting me`,
      thumbnail: image,
      url: '',
    })
  );
  client.user?.setActivity(`Serving ${client.guilds.cache.size} servers`);
});

client.on('guildMemberAdd', (member: GuildMember) => {
  console.log(member);
  member.send('Welcome!');
});

client.on('error', (e) => {
  console.error('Discord client error!', e);
});

client.login(token);

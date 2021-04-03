import {config} from 'dotenv';
import {Client, GuildMember, Message} from 'discord.js';
import {Fcal, FcalError} from 'fcal';
import {SphinxException} from './src/error';
import {findChannelId} from './src/channel';
import {SphinxCodeRunner} from './src/run/run';
import { SphinxKickCommand } from './src/commands/kick';

// Take all the variables from the env
// file to process.env
config();

// constants
const token = process.env.TOKEN;
const prefix: Array<string> = ['=', '!', ';run', 'sphinx'];

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
      sphinxMessage(message);
    } else if (command.type == ';run') {
      const executor = new SphinxCodeRunner(message);
    } else if(command.type == "!"){
      const sphinxCommand = message.content.slice(1, message.content.length).split(" ")[0]
      if(sphinxCommand == "kick"){
        const kick = new SphinxKickCommand(message).kickMember()
      }
    }
  }
});

client.on('guildMemberAdd', (member: GuildMember) => {
  console.log(member);
  member.send('Welcome!');
});

client.on('error', (e) => {
  console.error('Discord client error!', e);
});

client.login(token);

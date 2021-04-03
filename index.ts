import {config} from 'dotenv';
import {Client, GuildMember, Message} from 'discord.js';
import {Fcal, FcalError} from 'fcal';
import {SphinxException} from './src/error';
import {findChannelId} from './src/channel';
import {SphinxCodeRunner} from './src/run/run';
import { SphinxKickCommand } from './src/commands/kick';
import { createDiscordEmbed } from './src/embed';

// Take all the variables from the env
// file to process.env
config();

// constants
const token = process.env.TOKEN;
const prefix: Array<string> = ['=', '!', ';run', 'sphinx'];
const image = "http://i.imgur.com/p2qNFag.png"

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

interface BadWords {
  word : string | null
  badWord : string | null
  contains : boolean
}

const hasBadWors = (message:string):BadWords => {
  const badWords:Array<string> = [
    "fuck", "dumbass", "ass", "sex"
  ]
  const searchMessageArray = message.split(" ")
  for(let searchIndex=0; searchIndex<searchMessageArray.length; searchIndex++){
    const currentMessage = searchMessageArray[searchIndex]
    for(let idx=0; idx<badWords.length; idx++){
      if(currentMessage.includes(badWords[idx])){
        return {
          word : "`"+message+"`",
          badWord : badWords[idx],
          contains : true
        }
      }
    }
  }
  return {word:null, badWord:null, contains:false}
}

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
  const bad = hasBadWors(message.content)
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
  } else if(bad.contains){
    const warning = createDiscordEmbed({
      title : `Don't use bad words in the ${message.guild?.name} server`,
      author : {
        name : "Code Roller",
        image : image
      },
      color : "#e20202",
      description : `
      ${bad.badWord} found in a message
      `,
      thumbnail : image,
      url : ""
    })
    message.author.send(warning)
    message.channel.send(warning)
    message.delete()
  } else if(message.content.includes("https://discord.gg") || message.content.includes("https://discord.com/invite")){
    message.author.send(createDiscordEmbed({
      title : `Don't advertise servers in ${message.guild?.name}`,
      author : {
        name : "Code Roller",
        image : image
      },
      color : "#e20202",
      description : `Advertising not allowed in ${message.guild?.name}`,
      thumbnail : image,
      url : ""
    }))
    message.delete()
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

import {MessageEmbed, Message} from 'discord.js';

export class SphinxException {
  private readonly message: string;
  private messageChannel: Message;

  constructor(readonly messageData: string, message: Message) {
    this.message = messageData;
    this.messageChannel = message;
  }

  public evokeSphinxException = () => {
    const embed = new MessageEmbed()
      .setTitle('An unexpected error occured')
      .setAuthor('Code Roller', 'https://i.imgur.com/lm8s41J.png')
      .setColor('#CC0000')
      .setDescription(this.message)
      .setThumbnail('http://i.imgur.com/p2qNFag.png')
      .setTimestamp()
      .setURL('');

    this.messageChannel.channel.send(embed);
  };
}

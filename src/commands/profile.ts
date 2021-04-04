import {GuildMember, Message, User } from 'discord.js';

export class SphinxUserProfile {
  private message: Message;
  private author:User;
  /**
   * @constructor
   *
   * @param {Message} message The message class
   */
  constructor(message: Message) {
    this.message = message;
    this.author = this.message.author

    this.throwUserProfileCard()
  }

  private throwUserProfileCard = () => {
    const member = this.message.guild?.members.cache.filter((memberData:GuildMember) => {
      return memberData.displayName == this.author.username
    })
    console.log(member)
  }

  private createCardTemplate = (username:string, usertag:string):string => {
    return `
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
          <style>
            body {
              font-family: "Poppins", Arial, Helvetica, sans-serif;
              background: rgb(22, 22, 22);
              color: #fff;
              max-width: 300px;
            }

            .app {
              max-width: 300px;
              padding: 20px;
              display: flex;
              flex-direction: row;
              border-top: 3px solid rgb(16, 180, 209);
              background: rgb(31, 31, 31);
              align-items: center;
            }

            img {
              width: 50px;
              height: 50px;
              margin-right: 20px;
              border-radius: 50%;
              border: 1px solid #fff;
              padding: 5px;
            }
          </style>
        </head>
        <body>
          <div class="app">
            <img src="https://avatars.dicebear.com/4.5/api/avataaars/${name}.svg" />

            <h2>${username}${usertag}</h2>
          </div>
        </body>
      </html>
    `
  }

}

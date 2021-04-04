import {Message} from 'discord.js';
import { SphinxException } from '../error';

interface PollCommand {
  question : string,
  choices: Array<string>
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
  private message:Message
  private position:number = 0

  constructor(message:Message) {
    this.message = message

    this.createSphinxPoll()
  }

  public createSphinxPoll = ():void | null => {
    let parameters:string | Array<string> = this.message.content.split(" ")
    parameters = parameters.slice(1, parameters.length).join(" ")

    let tokens:Array<string> = []
    let quotationCount = 0
    let currentString = ""

    let character = this.currentCharacter(parameters)
    while(character != null){
      if(character == '"'){
        quotationCount += 1
      }

      if(quotationCount % 2 == 0){
        tokens.push(currentString)
        currentString = ""
      }
      currentString += character

      this.position += 1
      character = this.currentCharacter(parameters)
    }

    const formattedTokens = this.formatTokenArray(tokens)
    if(!this.verifyTokenData(formattedTokens)){
      console.log("error")
      return null
    }
  }

  private raisePollException = (message:string):void => {
    const error = new SphinxException(message, this.message)
    error.evokeSphinxException()
  }

  private verifyTokenData = (tokens:PollCommand):boolean => {
    if(tokens.question == undefined){
      this.raisePollException("Question not provided with the poll")
      return false
    } else if(tokens.question.trim().length == 0){
      this.raisePollException("Question is empty")
      return false
    } else if(tokens.choices.length < 2 || tokens.choices.length > 26) {
      this.raisePollException("The number of choices should be between 2 and 26")
      return false
    } else {
      for(let idx=0; idx<tokens.choices.length; idx++){
        const choice = tokens.choices[idx].slice(1, tokens.choices[idx].length)
        if(choice.trim().length == 0){
          console.log(idx)
          this.raisePollException("Choices cannot be empty")
          return false
        }
        tokens.choices[idx] = choice
      }
    }
    return true
  }

  private formatTokenArray = (tokens:Array<string>):PollCommand => {
    let returnArray:Array<string> = []
    for(let tokenIndex=0; tokenIndex<tokens.length; tokenIndex++){
      if(tokenIndex % 2 == 0){
        let value = tokens[tokenIndex]
        returnArray.push(value.slice(1, value.length))
      }
    }

    return {
      question : returnArray[0],
      choices : returnArray.slice(1, returnArray.length)
    }
  }

  private currentCharacter = (data:string):null | string => {
    if(data.length == this.position){
      return null
    } else {
      return data[this.position]
    }
  }
}
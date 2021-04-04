import { Message } from "discord.js";


export const sphinxSimplePoll = (message:Message) => {
    if(message.guild == null){
        return null;
    }

    let question:string | Array<string> = message.content.toString().trim().split(" ")
    question = question.slice(1, question.length).join(" ")
    
    if(question.length == 0){
        return null;
    }

    const name = `${message.author.username}${message.author.discriminator}`
    message.channel.send(`**${name}** asks: ${question}`).then((data:Message) => {
        data.react("👍")
        data.react("👎")
    }).catch(console.error)

    message.delete()
}
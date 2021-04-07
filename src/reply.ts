import axios from 'axios'
import { Message } from 'discord.js'

export const createBotReply = (message:Message, question:String):any => {
    if(message.author.bot){
        return null;
    }

    
    axios.post('https://sphinx-ai-reply.pranavbaburaj.repl.co/reply', {
        "question" : question
    },{ 
    headers : {"Content-Type": "application/json; charset=utf-8"}
    }).then(response => {
        const data = response.data
        message.channel.send(data.out)
    }).catch(error => {
        message.channel.send("I don't have answers for you")
    })

}
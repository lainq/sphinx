import axios from 'axios'
import { Message } from 'discord.js'
import * as http from 'http'
import * as https from 'https'
import { parse, UrlWithStringQuery } from 'url'

export const expandUrl = (url:any, message:Message) => {
    if(url == undefined){
        message.channel.send("Cannot find url :frowning:")
    }

    if(!(url.startsWith("https://") || url.startsWith("http://"))){
        message.channel.send("Invalid url :neutral_face:")
    }
    const parsedUrl:UrlWithStringQuery = parse(url);
    (parsedUrl.protocol == "https:" ? https : http).request({
        method : 'HEAD',
        host : parsedUrl.host,
        path : parsedUrl.pathname
    }, (response) => {
        const expandedUrl = response.headers.location || url
        message.channel.send(`The expanded url - ${expandedUrl}`)
    }).end()
}
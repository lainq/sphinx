import axios from 'axios'
import { Message } from 'discord.js'
import * as http from 'http'
import * as https from 'https'
import { parse, UrlWithStringQuery } from 'url'

/**
 * Expand a given url by sending a head request
 * to the url and capturing the header location
 * from the response
 * 
 * @param url The url to expand
 * @param message The message class to send the expanded message
 * to the channel
 */
export const expandUrl = (url:any, message:Message) => {
    // validate the urls
    if(url == undefined){
        message.channel.send("Cannot find url :frowning:")
    }

    if(!(url.startsWith("https://") || url.startsWith("http://"))){
        message.channel.send("Invalid url :neutral_face:")
    }
    const parsedUrl:UrlWithStringQuery = parse(url);
    // send the request based on protocols
    // http.request for http:// and
    // https.request for https://
    (parsedUrl.protocol == "https:" ? https : http).request({
        method : 'HEAD',
        host : parsedUrl.host,
        path : parsedUrl.pathname
    }, (response) => {
        const expandedUrl = response.headers.location || url
        message.channel.send(`The expanded url - ${expandedUrl}`)
    }).end()
}
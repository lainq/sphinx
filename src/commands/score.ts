import { Guild, User } from "discord.js"
import { SphinxDataStore } from "../store/store"

/**
 * Get the message information from a specific server
 * using the server id and sphinxdatastore
 * 
 * if the server is not defined, return null
 * else, loop through the array of users and 
 * if the id of the currentUser matches with the message
 * author throw the users score
 * 
 * @param {Guild} server The message guild
 * @param {User} member The author of the message
 * @param {SphinxDataStore} store The json data store 
 * @returns {number} The number of messages by the user divided
 * by 5
 */
export const userScore = (server:Guild, member:User, store:SphinxDataStore):number => {
    const data = store.get(server.id)
    if(data == undefined){
        return 0;
    }
    for(let idx=0; idx<data.length; idx++){
        const currentUser = data[idx]
        if(currentUser.id == member.id){
            return parseInt(Math.floor(currentUser.messages / 5).toString())
        }
    }
    return 0;
}
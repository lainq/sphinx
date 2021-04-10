import { Guild, User } from "discord.js"
import { SphinxDataStore } from "../store/store"

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
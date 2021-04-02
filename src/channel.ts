import { Channel, Client } from 'discord.js'

export const findChannelId = (channelId:string, client:Client) => {
    const channels = client.channels.cache
    const findChannel = channels.find((value:Channel) => {
        return value.id == channelId
    })
    return findChannel
}
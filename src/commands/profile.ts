import { Message } from "discord.js";

export class SphinxUserProfile {
    private message : Message;

    /**
     * @constructor
     * 
     * @param {Message} message The message class
     */
    constructor(message:Message) {
        this.message = message
    }
}
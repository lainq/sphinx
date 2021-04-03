import { Message } from "discord.js";

export class SphinxUserProfile {
    private message : Message;

    constructor(message:Message) {
        this.message = message
    }
}
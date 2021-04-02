import { Message } from "discord.js";

export interface Position {
    position : number,
    tail : boolean,
}

interface Snippet {
    code : string,
    language:string
}

export class SphinxCodeRunner {
    private readonly code:string;
    private message:Message
    private snippet:Snippet
     
    private character:string | null = null
    private position:Position = {position:0, tail:false}

    /**
     * @constructor
     * 
     * @param {Message} message The message class
     */
    constructor(message:Message){
        this.message = message
        this.code = message.content.toString()

        this.snippet = this.createCodeSnippet()
    }

    /**
     * @private
     * 
     * Get the code snipper 
     * from the message
     * 
     * @returns The code snippet
     */
    private createCodeSnippet = ():Snippet => {
        let code = this.code.slice(4, this.code.length)
        console.log(code)
        return {code:"", language:""}
    }
}
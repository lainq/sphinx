
export interface Position {
    position : number,
    tail : boolean,
}

export class SphinxCodeRunner {
    private readonly code:string;
    private position:Position
     
    private character:string | null = null

    constructor(code:string, position:Position){
        this.code = code
        this.position = position
    }
}
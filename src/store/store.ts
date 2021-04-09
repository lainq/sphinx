
export interface DataStore {
    databaseName : string,
    databasePath : string | null,
    exists : boolean
}

export class SphinxDataStore {
    private readonly database:string
    private path: string | null
    private exists:boolean

    private data:string = ""

    constructor(data:DataStore) {
        this.database = data.databaseName
        this.path = data.databasePath
        this.exists = data.exists

        if(this.exists){
            
        }
    }

    private throwStoreException = (message:string) => {
        console.error(message)
        process.exit()
    }

}
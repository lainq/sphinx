import { existsSync, readFileSync, writeFile } from "fs"

export interface DataStore {
    databaseName : string,
    databasePath : string
    exists : boolean
}

export class SphinxDataStore {
    private readonly database:string
    private path: string
    private exists:boolean

    private data:string = ""

    constructor(data:DataStore) {
        this.database = data.databaseName
        this.path = data.databasePath
        this.exists = data.exists

        this.data = this.loadFromFile(this.path)
        console.log(this.data)
    }

    private loadFromFile = (path:string):string => {
        if(!this.fileExists(path)) {
            return JSON.parse(this.writeFileData(path, {}, true))
        }
        return JSON.parse(readFileSync(path).toString())
    }

    private writeFileData(path:string, data:any, json:boolean):string{
        if(json){
            data = JSON.stringify(data)
        }
        writeFile(path, data, (error:any) => {
            if(error) {
                this.throwStoreException(error.message)
            }
        })
        return data
    }

    private fileExists = (path:string | null) => {
        if(path == null){
            return false
        }
        try {
            return existsSync(path)
        } catch(exception) {
            return false
        }
    }

    private throwStoreException = (message:string) => {
        console.error(message)
        process.exit()
    }

    public joinServer = (serverId:string):void => {
        this.data[serverId.toString()] 
    }

}
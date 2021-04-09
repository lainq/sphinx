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

    private data:Map<string, any> = new Map<string, any>()

    constructor(data:DataStore) {
        this.database = data.databaseName
        this.path = data.databasePath
        this.exists = data.exists

        this.data = this.createArray(this.loadFromFile(this.path))
    }

    private createArray = (loadValue:object):Map<string, any> => {
        return new Map<string, any>(Object.entries(loadValue))
    }

    private loadFromFile = (path:string):object => {
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
        if(this.data.get(serverId) == undefined) {
            this.data.set(serverId, [])
            console.log("Hi")
        }
        
        this.writeFileData(
            this.path,
            Object.fromEntries(this.data),
            true
        )
    }

}
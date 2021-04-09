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
        }
        
        this.writeFileData(
            this.path,
            Object.fromEntries(this.data),
            true
        )
    }

    public addMessage = (serverId:string, memberId:string) => {
        let data = this.data.get(serverId)
        if(data == undefined) {
            this.joinServer(serverId)
            data = this.data.get(serverId)
        }

        for(let idx=0; idx<data.length; idx++){
            let currentUser = data[idx]
            if(currentUser.id == memberId){
                currentUser.messages += 1
                this.writeFileData(
                    this.path,
                    Object.fromEntries(this.data),
                    true
                )
                return null
            }
        }

        data.push({id : memberId, messages:1})
        this.writeFileData(
            this.path,
            Object.fromEntries(this.data),
            true
        )
    }
}
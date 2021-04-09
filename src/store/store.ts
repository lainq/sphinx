import { existsSync, readFileSync, writeFile } from "fs"

export interface DataStore {
    // the name of the database
    databaseName : string,

    // the path of the database
    databasePath : string

    // teh database exists or not
    exists : boolean
}

export class SphinxDataStore {
    private readonly database:string
    private path: string
    private exists:boolean

    private data:Map<string, any> = new Map<string, any>()

    /**
     * @constructor
     * 
     * @param data The DataStore interface object the consists of the
     * database name, the path of the database and whether the database
     * exists or not
     */
    constructor(data:DataStore) {
        this.database = data.databaseName
        this.path = data.databasePath
        this.exists = data.exists

        this.data = this.createArray(this.loadFromFile(this.path))
    }

    /**
     * @private
     * 
     * Take in a javascript object and convert it into
     * Map<string, any> object
     * 
     * @param {object} loadValue The object to convert  to a map
     * @returns {Map<String, any} The newly created Map object
     */
    private createArray = (loadValue:object):Map<string, any> => {
        return new Map<string, any>(Object.entries(loadValue))
    }

    /**
     * @private
     * 
     * Check if the file exists, if yes, Read the file
     * and parse the json string into a javascript object 
     * which is returned
     * 
     * else, create a new file and write an empty 
     * dict into it and return the dict
     * 
     * @param path The path of the file to load data from
     * @returns {object} The parsed objects
     */
    private loadFromFile = (path:string):object => {
        if(!this.fileExists(path)) {
            return JSON.parse(this.writeFileData(path, {}, true))
        }
        return JSON.parse(readFileSync(path).toString())
    }

    /**
     * @private
     * 
     * Write data into a specific file . If the file
     * is a json file, convert the string to a json string
     * 
     * @param path The path of the file
     * @param data The data to write to the file
     * @param json If the data should be converted to a json
     * string or not
     * @returns {string} The data that we wrote into the
     * file
     */
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

    /**
     * @private
     * 
     * Checks if a file exists using fs.existsSync()
     * 
     * @param {string|null} path The path of the file
     * @returns {boolean}
     */
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

    /**
     * @private
     * 
     * Throw any errors related to the sphinxstore
     * 
     * @param {string} message The message
     */
    private throwStoreException = (message:string) => {
        console.error(message)
        process.exit()
    }

    /**
     * @public
     * 
     * Add the new server id to the sphinx storage
     * if it does not exists
     * 
     * @param {string} serverId The id of the newly joined server
     */
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

    /**
     * @public
     * 
     * Check if the server is registered, if nom
     * register the server
     * 
     * Check if the user is registered, if no register
     * the new user. Else add the message count for the
     * specific user
     * 
     * @param {string} serverId The id of the server
     * @param {string} memberId The id of the member
     * @returns {void}
     */
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
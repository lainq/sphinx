import {join} from 'path';
import {cwd} from 'process';
import {SphinxDataStore} from '../../src/store/store';

const data = new SphinxDataStore({
  databaseName: 'hello',
  databasePath: join(cwd(), 'test.json'),
  exists: false,
});


// data.joinServer("34242")
console.log(data.get("34242"))
// console.log(data.data)

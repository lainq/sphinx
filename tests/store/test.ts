import {join} from 'path';
import {cwd} from 'process';
import {SphinxDataStore} from '../../src/store/store';

const data = new SphinxDataStore({
  databaseName: 'hello',
  databasePath: join(cwd(), 'test.json'),
  exists: false,
});

data.addMessage('100', '383884848');

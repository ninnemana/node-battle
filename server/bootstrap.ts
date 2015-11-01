import * as connectLivereload from 'connect-livereload';
import * as express from 'express';
import * as minilrFn from 'mini-lr';
import * as openResource from 'open';
import * as serveStatic from 'serve-static';
import {resolve} from 'path';
import {APP_BASE, LIVE_RELOAD_PORT, PATH, PORT, ENV} from '../tools/config';

const minilr = minilrFn();

const INDEX_DEST_PATH = resolve(PATH.cwd, PATH.dest[ENV].base, 'index.html');


export function serveSPA() {

  const server = express();
  minilr.listen(LIVE_RELOAD_PORT);

  server.use(
    APP_BASE,
    connectLivereload({ port: LIVE_RELOAD_PORT }),
    serveStatic(resolve(PATH.cwd, PATH.dest[ENV].base))
  );

  server.all(APP_BASE + '*', (req, res) =>
    res.sendFile(INDEX_DEST_PATH)
  );

  server.listen(PORT, () =>
    openResource('http://localhost:' + PORT + APP_BASE)
  );
}

export function notifyLiveReload(changedFiles: string[]) {
  minilr.changed({
    body: { files: changedFiles }
  });
}

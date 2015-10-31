import {argv} from 'yargs';
import {join} from 'path';
import * as fs from 'fs';

const resolve = require.resolve;

const CWD = process.cwd();
const pkg = JSON.parse(fs.readFileSync(CWD + '/package.json', 'utf8'));

// --------------
// Configuration.
export const ENV = argv['env'] || 'dev';
export const DEBUG = argv['debug'] || false;
export const PORT = argv['port'] || 5555;
export const LIVE_RELOAD_PORT = argv['reload-port'] || 4002;
export const APP_BASE = argv['base'] || '/';

const CLIENT_SRC = 'client';
const CLIENT_DEST = 'dist';
export const ANGULAR_BUNDLES = './node_modules/angular2/bundles';
export const VERSION = pkg.version;


export const PATH = {
  cwd: CWD,
  tools: 'tools',
  dest: {
    all: CLIENT_DEST,
    dev: {
      all: `${CLIENT_DEST}/${ENV}`,
      lib: `${CLIENT_DEST}/${ENV}/lib`,
      css: `${CLIENT_DEST}/${ENV}/css`,
      fonts: `${CLIENT_DEST}/${ENV}/fonts`,
      components: `${CLIENT_DEST}/${ENV}/components`
    },
    test: 'test',
    tmp: '.tmp'
  },
  src: {
    all: CLIENT_SRC,
    jslib_inject: [
      // Order is quite important here for the HTML tag injection.
      resolve('es6-shim/es6-shim.min.js'),
      resolve('es6-shim/es6-shim.map'),
      resolve('systemjs/dist/system.src.js'),
      `${CLIENT_SRC}/system.config.js`,
      `${ANGULAR_BUNDLES}/angular2.dev.js`,
      `${ANGULAR_BUNDLES}/router.dev.js`,
      `${ANGULAR_BUNDLES}/http.dev.js`
    ],
    jslib_copy_only: [
      resolve('systemjs/dist/system-polyfills.js'),
      resolve('systemjs/dist/system-polyfills.js.map')
    ],
    csslib: [
      resolve('bootstrap/dist/css/bootstrap.min.css'),
      resolve('bootstrap/dist/css/bootstrap.css.map')
    ],
    fonts: [
      resolve('bootstrap/dist/fonts/glyphicons-halflings-regular.eot'),
      resolve('bootstrap/dist/fonts/glyphicons-halflings-regular.svg'),
      resolve('bootstrap/dist/fonts/glyphicons-halflings-regular.ttf'),
      resolve('bootstrap/dist/fonts/glyphicons-halflings-regular.woff'),
      resolve('bootstrap/dist/fonts/glyphicons-halflings-regular.woff2')
    ],
    tpls: [
      `${CLIENT_SRC}/components/**/*.html`,
    ],
    ts: [join(CLIENT_SRC, '**/*.ts'), '!' + join(CLIENT_SRC, '**/*_spec.ts')]
  }
};



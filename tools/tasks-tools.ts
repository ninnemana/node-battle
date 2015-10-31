import * as gulp from 'gulp';
import {join} from 'path';
import * as slash from 'slash';
import * as ts from 'gulp-typescript';
import * as sourcemaps from 'gulp-sourcemaps';
import * as plumber from 'gulp-plumber';
import * as inject from 'gulp-inject';
import * as template from 'gulp-template';
import * as inlineNg2Template from 'gulp-inline-ng2-template';
import * as typescript from 'gulp-typescript';

import {PATH, APP_BASE, VERSION} from './config';


let injectables: string[] = [];

export function injectableAssetsRef() {
  return injectables;
}

export function registerInjectableAssetsRef(paths: string[], target: string = '') {
  injectables = injectables.concat(
    paths
      .filter(path => !/(\.map)$/.test(path))
      .map(path => join(target, slash(path).split('/').pop()))
  );
}

export function transformPath(env) {
  const v = '?v=' + VERSION;
  return function (filepath) {
    const filename = filepath.replace('/' + PATH.dest[env].all, '') + v;
    arguments[0] = join(APP_BASE, filename);
    return inject.transform.apply(inject.transform, arguments);
  };
}

// TODO: Add an interface to register more template locals.
export const templateLocals = {
  VERSION,
  APP_BASE
};

export const tsProject = ts.createProject('tsconfig.json');

export function compileTs(files?: string[]) {

  // TODO id does not work if we only compile the changed file,
  // check why and correct it later (compilation time would be lower)
  files = PATH.src.ts;

  const result = gulp.src(files)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(inlineNg2Template({ base: PATH.src.all }))    
    .pipe(typescript(tsProject));

  return result.js
    .pipe(sourcemaps.write())
    .pipe(template(templateLocals))
    .pipe(gulp.dest(PATH.dest.dev.all));
}


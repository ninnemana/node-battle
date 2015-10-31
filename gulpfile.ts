import {join} from 'path';
import * as gulp from 'gulp';
import * as del from 'del';
import * as runSequence from 'run-sequence';
import * as plumber from 'gulp-plumber';
import * as typescript from 'gulp-typescript';
import * as sass from 'gulp-sass';
import * as inject from 'gulp-inject';
import * as template from 'gulp-template';
import * as tslint from 'gulp-tslint';
import * as inlineNg2Template from 'gulp-inline-ng2-template';
import * as tslintStylish from 'gulp-tslint-stylish';
import * as shell from 'gulp-shell';
import {Server} from 'karma';

import {ENV, PATH} from './tools/config';
import {
registerInjectableAssetsRef,
compileTs,
injectableAssetsRef,
transformPath,
templateLocals,
tsProject
} from './tools/tasks-tools';

import {serveSPA, notifyLiveReload} from './server/bootstrap';

// --------------
// Configuration.
registerInjectableAssetsRef(PATH.src.jslib_inject, PATH.dest.dev.lib);
registerInjectableAssetsRef(PATH.src.csslib, PATH.dest.dev.css);


// --------------
// Client.
gulp.task('build.csslib.dev', () => {
  return gulp.src(PATH.src.csslib)
    .pipe(gulp.dest(join(PATH.dest.dev.css)));
});

gulp.task('build.fonts', () => {
  return gulp.src(PATH.src.fonts)
    .pipe(gulp.dest(join(PATH.dest.dev.fonts)));
});

gulp.task('build.sass.dev', () => {
  return gulp.src(join(PATH.src.all, '**', '*.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(PATH.src.all));
});

gulp.task('build.jslib.dev', () => {
  const src = PATH.src.jslib_inject.concat(PATH.src.jslib_copy_only);
  return gulp.src(src)
    .pipe(gulp.dest(PATH.dest.dev.lib));
});

gulp.task('build.js.dev', () => {
  return compileTs();
});

gulp.task('build.tpls.dev', () => {
  return gulp.src(PATH.src.tpls)
    .pipe(gulp.dest(join(PATH.dest.dev.components)));
});

gulp.task('build.index.dev', () => {

  const injectables = injectableAssetsRef();
  const target = gulp.src(injectables, { read: false });

  return gulp.src(join(PATH.src.all, 'index.html'))
    .pipe(inject(target, {
      transform: transformPath('dev')
    }))
    .pipe(template(templateLocals))
    .pipe(gulp.dest(PATH.dest.dev.all));
});

gulp.task('build.dev', (done) =>
  runSequence('clean.dist',
    [
      'tslint',
      'build.jslib.dev',
      'build.sass.dev',
      'build.js.dev',
      'build.tpls.dev',
      'build.csslib.dev',
      'build.fonts'
    ],
    'build.index.dev',
    done)
);

gulp.task('watch.dev', ['build.dev'], () => {
  return gulp.watch(join(PATH.src.all, '**/*'), () => gulp.start('build.dev'));
});

// --------------
// Serve.
gulp.task('server.start', (done) => {
  serveSPA();
  done();
});

gulp.task('watch.serve', () => {
  return gulp.watch(PATH.src.ts, evt => {
    const changedFiles: string[] = [evt.path];
    const resp = compileTs(changedFiles);
    notifyLiveReload(changedFiles)
    return resp;
  });
});

gulp.task('serve', (done) =>
  runSequence(`build.${ENV}`, 'server.start', 'watch.serve', done)
);

// --------------
// Test.
gulp.task('build.test', () => {

  const src = [join(PATH.src.all, '**/*.ts'), '!' + join(PATH.src.all, 'bootstrap.ts')];

  const result = gulp.src(src)
    .pipe(plumber())
    .pipe(inlineNg2Template({ base: PATH.src.all }))
    .pipe(typescript(tsProject));

  return result.js
    .pipe(gulp.dest(PATH.dest.test));
});

gulp.task('watch.test', ['build.test'], () => {
  return gulp.watch(PATH.src.ts, () => gulp.start('build.test'));
});

gulp.task('karma.start', (done) => {
  new Server({
    configFile: join(process.cwd(), 'karma.conf.js'),
    singleRun: true
  }, done).start();
});

gulp.task('test', (done) =>
  runSequence('clean.test', 'build.test', 'karma.start', done)
);

// --------------
// Lint.
gulp.task('tslint', () => {

  const src = [
    join(PATH.src.all, '**/*.ts'),
    '!' + join(PATH.src.all, '**/*.d.ts'),
    join(PATH.tools, '**/*.ts'),
    '!' + join(PATH.tools, '**/*.d.ts')
  ];

  return gulp.src(src)  
    .pipe(tslint())
    .pipe(tslint.report(tslintStylish, {
      emitError: false,
      configuration: {
        sort: true,
        bell: true
      }
    }));
});

// --------------
// Clean.
gulp.task('clean', ['clean.dist', 'clean.test', 'clean.tmp']);

gulp.task('clean.dist', () => {
  return del(PATH.dest.all);
});

gulp.task('clean.test', () => {
  return del(PATH.dest.test);
});

gulp.task('clean.tmp', () => {
  return del(join(PATH.dest.tmp));
});

// --------------
// Postinstall.
gulp.task('npm', () => {
  return shell.task(['npm prune']);
});

gulp.task('tsd', () => {
  return shell.task(['tsd reinstall --clean', 'tsd link', 'tsd rebundle']);
});

gulp.task('postinstall', (done) => {
  runSequence('clean', 'npm', done)
});

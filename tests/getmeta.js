var test = require('tap').test,
    cli = require('../'),
    log = cli.log,

    resolve = require('path').resolve;


test('getmeta nonesuch', function(t) {
    var actual = cli.getmeta('/does/not/exist');

    t.equal(actual.cli.name, 'mojito-cli');
    t.equal(actual.cli.path, resolve(__dirname, '../'));
    t.ok(actual.cli.version);
    t.ok(actual.cli.description);
    t.ok(actual.cli.dependencies);
    t.ok(actual.cli.commands);

    t.false(actual.app);

    t.false(actual.mojito);

    t.end();

/*
console.log(actual);
{ cli:
   { name: 'mojito-cli',
     path: '/Users/isao/Repos/wip/mojito-cli',
     version: '0.0.0PR2',
     description: 'The mojito-cli package provides command line helpers for Mojito developers.',
     dependencies: { 'mojito-create': '*', npmlog: '0.0.2', nopt: '~2.1.1' },
     commands: [ 'create', 'help', 'info', 'version' ] },
  app: false,
  mojito: false }
*/
});

test('getmeta missingMojito', function(t) {
    var path = resolve(__dirname, 'fixtures/missingMojito'),
        actual = cli.getmeta(path);

    t.equal(actual.cli.name, 'mojito-cli');
    t.equal(actual.cli.path, resolve(__dirname, '../'));
    t.ok(actual.cli.version);
    t.ok(actual.cli.description);
    t.ok(actual.cli.dependencies);
    t.ok(actual.cli.commands);

    t.equal(actual.app.name, 'missingMojito');
    t.equal(actual.app.path, path);
    t.equal(actual.app.needsMojito, true);
    t.equal(actual.app.version, '0.0.1');
    t.equal(actual.app.description, 'just a test fixture');
    t.equal(actual.app.dependencies.mojito, '>0.5.6');

    t.false(actual.mojito);

    t.end();
/*
console.log(actual);
{ cli:
   { name: 'mojito-cli',
     path: '/Users/isao/Repos/wip/mojito-cli',
     version: '0.0.0PR2',
     description: 'The mojito-cli package provides command line helpers for Mojito developers.',
     dependencies: { 'mojito-create': '*', npmlog: '0.0.2', nopt: '~2.1.1' },
     commands: [ 'create', 'help', 'info', 'version' ] },
  app:
   { name: 'missingMojito',
     path: '/Users/isao/Repos/wip/mojito-cli/tests/fixtures/missingMojito',
     version: '0.0.1',
     description: 'just a test fixture',
     dependencies: { mojito: '>0.5.6' },
     needsMojito: true },
  mojito: false }
*/
});

test('getmeta someapp', function(t) {
    var path = resolve(__dirname, 'fixtures/someapp'),
        actual = cli.getmeta(path);

    t.equal(actual.cli.name, 'mojito-cli');
    t.equal(actual.cli.path, resolve(__dirname, '../'));
    t.ok(actual.cli.version);
    t.ok(actual.cli.description);
    t.ok(actual.cli.dependencies);
    t.ok(actual.cli.commands);

    t.equal(actual.app.name, 'someapp');
    t.equal(actual.app.path, path);
    t.equal(actual.app.needsMojito, false);
    t.equal(actual.app.version, '0.0.1');
    t.equal(actual.app.description, 'just a test fixture');
    t.equal(actual.app.dependencies.mojito, '>0.5.6');

    t.equal(actual.mojito.name, 'mojito');
    t.equal(actual.mojito.path, resolve(path, 'node_modules/mojito'));
    t.ok(actual.mojito.commands);
    t.equal(actual.mojito.commandsPath, resolve(path, 'node_modules/mojito/lib/app/commands'));
    t.equal(actual.mojito.version, '0.5.6');
    t.ok(actual.mojito.description);

    t.end();

/*
console.log(actual);
{ cli:
   { name: 'mojito-cli',
     path: '/Users/isao/Repos/wip/mojito-cli',
     version: '0.0.0PR2',
     description: 'The mojito-cli package provides command line helpers for Mojito developers.',
     dependencies: { 'mojito-create': '*', npmlog: '0.0.2', nopt: '~2.1.1' },
     commands: [ 'create', 'help', 'info', 'version' ] },
  app:
   { name: 'someapp',
     path: '/Users/isao/Repos/wip/mojito-cli/tests/fixtures/someapp',
     version: '0.0.1',
     description: 'just a test fixture',
     dependencies: { mojito: '>0.5.6' },
     needsMojito: false },
  mojito:
   { name: 'mojito',
     path: '/Users/isao/Repos/wip/mojito-cli/tests/fixtures/someapp/node_modules/mojito',
     version: '0.5.6',
     description: 'Mojito provides an architecture, components and tools for developers to build complex web applications faster.',
     dependencies:
      { colors: '*',
        express: '2.5.10',
        glob: '~3.1.11',
        'js-yaml': '1.0.2',
        jslint: '~0.1.9',
        mime: '1.2.4',
        mkdirp: '>0.3',
        request: '2.9.202',
        rimraf: '>2',
        semver: '1.0.14',
        wrench: '~1.3.9',
        ycb: '~1.0.0',
        yui: '~3.9.0',
        yuidocjs: '~0.3.14',
        yuitest: '~0.7.4',
        'yuitest-coverage': '~0.0.6' },
     commandsPath: '/Users/isao/Repos/wip/mojito-cli/tests/fixtures/someapp/node_modules/mojito/lib/app/commands',
     commands:
      [ 'build',
        'compile',
        'create',
        'docs',
        'gv',
        'help',
        'info',
        'jslint',
        'profiler',
        'start',
        'test',
        'version' ] } }
*/
});

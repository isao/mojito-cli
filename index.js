/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true */
'use strict';

var log = require('./lib/log'),
    nopt = require('nopt'),
    getmoj = require('./lib/mojmeta'),
    getapp = require('./lib/appmeta'),

    options = {'help': Boolean, 'version': Boolean, 'debug': Boolean},
    aliases = {h: '--help', v: '--version', d: '--debug'},
    builtin,
    external;


function help(meta) {
    var basic = Object.keys(options),
        every = meta.mojito ? basic.concat(meta.mojito.commands) : basic;

    log.info('Usage: %s <command> [options]', meta.cli.binname);
    log.info('The %s package provides command line helpers for mojito developers.', meta.cli.name);
    log.info('Available commands: %s', every.join(', '));
    if (!meta.mojito) {
        log.info(
            'Additional commands are available from within an application'
            + ' directory that has\nmojito installed.'
        );
    }
}

function version(meta) {
    log.info('%s v%s', meta.cli.name, meta.cli.version);

    if (meta.app) {
        log.info('%s v%s', meta.app.name, meta.app.version);
        if (!(meta.app.dependencies && meta.app.dependencies.mojito)) {
            log.warn('Mojito is not listed as a dependency in your package.json. Fix with:');
            log.warn('    npm install mojito --save');
        }
    }

    if (meta.mojito) {
        log.info('%s v%s (installed locally)', meta.mojito.name, meta.mojito.version);
    }
}

function getmeta(cwd) {
    var cli,
        app,
        mojito,
        meta = module.exports.meta;

    cli = require('./package');
    meta.cli = {
        name: cli.name,
        binname: Object.keys(cli.bin)[0],
        version: cli.version
    };
    log.debug('%s v%s at %s', cli.name, cli.version, __dirname);

    meta.app = getapp(cwd);
    if (meta.app) {
        meta.mojito = getmoj(cwd);
    }

    return meta;
}

function main(argv, cwd, cb) {
    var opts = nopt(options, aliases, argv, 0),
        args = opts.argv.remain.concat(),
        cmd = args.shift(),
        meta;

    delete opts.argv; // do not need original, cooked

    if (opts.debug) {
        log.level = 'debug';
    }

    if(!cmd) {
        if(opts.version) {
            cmd = 'version';
        } else if(opts.help) {
            cmd = 'help';
        } else {
            log.error('Missing command parameter.');
            cmd = 'help';
        }
    }

    if ('info' === cmd) {
        cmd = 'version'; // alias
    }

    log.debug('command: %s, args: %j, options: %j', cmd, args, opts);
    meta = getmeta(cwd);

    if (builtin.hasOwnProperty(cmd)) {
        builtin[cmd](meta, cb);
        return;
    }

    return cmd;
}

builtin = {
    'help': help,
    'version': version,
};

external = {
    'create': './mojito-create'
};

module.exports = main;
module.exports.log = log;
module.exports.meta = {
    cli: null,
    app: null,
    mojito: null
};

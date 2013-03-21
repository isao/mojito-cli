/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true */
'use strict';

var log = require('./lib/log'),
    nopt = require('nopt'),

    options = {'help': Boolean, 'version': Boolean, 'debug': Boolean},
    aliases = {h: '--help', v: '--version', d: '--debug'},

    getmoj = require('./lib/mojmeta'),
    getapp = require('./lib/appmeta'),
    handoff = require('./lib/handoff'),

    builtin, // function map
    bundled, // package name map

    PREFIX = 'mojito-'; // um.


function help(meta, cb) {
    var basic = Object.keys(options),
        every = meta.mojito ? basic.concat(meta.mojito.commands) : basic;

    log.info('Usage: %s <command> [options]', meta.cli.binname);
    log.info('The %s package provides command line helpers for mojito developers.', meta.cli.name);
    log.info('Available commands: %s', every.join(', '));
    if (!meta.mojito) {
        log.info(
            'Additional commands are available from within an application ' +
            'directory that has\nmojito installed.'
        );
    }
}

function version(meta, cb) {
    var appdeps = meta.app && meta.app.dependencies;

    log.info('%s v%s', meta.cli.name, meta.cli.version);

    if (appdeps) {
        log.info('%s v%s', meta.app.name, meta.app.version);
        if (appdeps && appdeps.mojito) {
            log.info('declared dependencies: %s', Object.keys(appdeps).join(', '));
        } else {
            log.warn('Mojito is not listed as a dependency in your package.json. Fix with:');
            log.warn('    npm install mojito --save');
            log.warn('');
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

function altcmd(opts) {
    var cmd;
    if (opts.version) {
        cmd = 'version';
    } else if (opts.help) {
        cmd = 'help';
    } else {
        log.error('No command...');
        cmd = 'help';
    }
    return cmd;
}

function main(argv, cwd, cb) {
    var opts = nopt(options, aliases, argv, 0),
        cmd = (opts.argv.remain.shift() || '').toLowerCase(),
        meta;

    if (opts.debug) {
        log.level = 'debug';
    }

    // treat lone --help and --version flags like commands
    if (!cmd) {
        cmd = altcmd(opts);
    }

    // alias info to version
    if ('info' === cmd) {
        cmd = 'version';
    }

    log.debug('cmd: %s, opts: %j', cmd, opts);

    // collect some metadata from available package.json files
    meta = getmeta(cwd);

    // dispatch/handoff the command
    if (builtin.hasOwnProperty(cmd)) {
        log.debug('runnning local function');
        builtin[cmd](meta, cb);

    } else if (meta.mojito && meta.mojito.commands.indexOf(cmd)) {
        log.debug('delegating to %s/%s', meta.mojito.commands.path, cmd);
        handoff(cmd, meta, opts, cb);

    } else if (bundled.hasOwnProperty(cmd)) {
        log.debug('delegating %s to %s', cmd, bundled[cmd]);
        handoff.require(bundled[cmd], opts, cb);

    } else {
        log.debug('shelling out to %s/%s', PREFIX + cmd);
        handoff.shell(PREFIX + cmd, opts, process.env);
    }

    return cmd;
}

builtin = {
    'help': help,
    'version': version
};

bundled = {
    'create': 'mojito-create'
};

module.exports = main;
module.exports.log = log;
module.exports.meta = {
    cli: null,
    app: null,
    mojito: null
};

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
    bundled; // package name map


function getmeta(cwd) {
    var app,
        mojito,
        cli = require('./package'),
        meta = module.exports.meta;

    log.debug('%s v%s at %s', cli.name, cli.version, __dirname);
    meta.cli = {
        name: cli.name,
        binname: Object.keys(cli.bin)[0],
        version: cli.version
    };

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

    log.debug('cmd: %s, opts: %j', cmd, opts);

    // collect some metadata from available package.json files
    meta = getmeta(cwd);

    // do cmd
    if ('help' === cmd) {
        

    } else if (builtin.hasOwnProperty(cmd)) {
        log.debug('runnning local function');
        handoff(builtin[cmd], meta, opts, cb);

    } else if (meta.mojito && meta.mojito.commands.indexOf(cmd)) {
        log.debug('delegating to %s/%s', meta.mojito.commands.path, cmd);
        handoff.legacy(cmd, meta, opts, cb);

    } else {
        log.error('Unable to execute command %s', cmd);
        help(meta, cb);
    }

    return cmd;
}

builtin = {
    'help': '../comamnds/help',
    'info': '../commands/version',
    'version': '../commands/version'
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

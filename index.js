/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true */
'use strict';

var resolve = require('path').resolve,
    log = require('./lib/log'),
    nopt = require('nopt'),

    options = {'help': Boolean, 'version': Boolean, 'debug': Boolean},
    aliases = {h: '--help', v: '--version', d: '--debug'},
    getmoj = require('./lib/mojmeta'),
    getapp = require('./lib/appmeta'),
    bundled; // package name map


function getmeta(cwd) {
    var app,
        mojito,
        cli = require('./package'),
        meta = {};

    log.debug('%s v%s at %s', cli.name, cli.version, __dirname);
    meta.cli = {
        name: cli.name,
        binname: Object.keys(cli.bin)[0],
        version: cli.version,
        commands: Object.keys(bundled).sort()
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

function load(pathname) {
    var mod;
    try {
        mod = require(pathname);
    } catch(err) {}
    return mod;
}

function exec(cmd, args, opts, meta, cb) {
    var mod;

    if (('help' === cmd) && opts.argv.remain.length) {


    } else if (bundled.hasOwnProperty(cmd)) {
        log.debug('runnning local command %s', bundled[cmd]);
        mod = load(bundled[cmd]);
        mod(args, opts, meta, cb);

    } else if (meta.mojito && meta.mojito.commands.indexOf(cmd)) {
        log.debug('runnning legacy mojito command %s', cmd);
        mod = load(resolve(meta.mojito.commands.path, cmd));
        mod.run(args, opts, cb);

    } else {
        log.error('Unable to execute command %s', cmd);
    }
}

function main(argv, cwd, cb) {
    var opts = nopt(options, aliases, argv, 0),
        args = opts.argv.remain,
        cmd = (args.shift() || '').toLowerCase();

    if (opts.debug) {
        log.level = 'debug';
    }

    // treat lone --help and --version flags like commands
    if (!cmd) {
        cmd = altcmd(opts);
    }

    log.debug('cmd: %s, opts: %j', cmd, opts);
    exec(cmd, args, opts, getmeta(cwd), cb);
    return cmd;
}

bundled = {
    'create': 'mojito-create',
    'help': './commands/help',
    'info': './commands/version',
    'version': './commands/version'
};

module.exports = main;
module.exports.log = log;
module.exports.getmeta = getmeta;

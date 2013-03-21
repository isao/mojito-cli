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
    aliases = {h: '--help', v: '--version', info: '--version', d: '--debug'},
    builtin,
    external;


function help(meta) {
    var these = Object.keys(options),
        commands = meta.mojito ? these.concat(meta.mojito.commands) : these;

    log.info('Usage: %s <command> [options]', meta.cli.binname);
    log.info('The %s package provides command line helpers for mojito developers.', meta.cli.name);
    log.info('Available commands: %s', commands.join(', '));
    if (!meta.mojito) {
        log.info(
            'Additional commands are available from within an application'
            + ' directory that has\nmojito installed.'
        );
    }
}

function version(meta) {

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
        mojito = getmoj(cwd);
    }

    return meta;
}

function main(argv, cwd, cb) {
    var opts = nopt(options, aliases, argv, 0),
        args = opts.argv.remain.concat(),
        cmd = args.shift(),
        meta;

    delete opts.argv;

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

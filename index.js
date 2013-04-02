/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true */
'use strict';

var resolve = require('path').resolve,
    log = require('./lib/log'),
    nopt = require('nopt'),

    options = {'help': Boolean, 'version': Boolean, 'debug': Boolean},
    aliases = {h: '--help', v: '--version', d: '--debug'},
    readpkg = require('./lib/readpkg'),
    bundled; // map of package name:require-string


function getmeta(cwd) {
    var cli = require('./package'),
        meta = {};

    log.debug('%s v%s at %s', cli.name, cli.version, __dirname);
    meta.cli = {
        name: cli.name,
        description: cli.description,
        binname: Object.keys(cli.bin)[0],
        version: cli.version,
        commands: Object.keys(bundled)
    };

    meta.app = readpkg(cwd);
    if (meta.app) {
        meta.mojito = readpkg.mojito(cwd);
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

function load(str, cmd) {
    var mod;
    try {
        // require module by pathname, or by bundled command name
        mod = require(str || bundled[cmd]);
    } catch(err) {
        log.debug('unable to require %s', str || bundled[cmd]);
    }
    return mod;
}

function exec(cmd, args, opts, meta, cb) {
    var mod,
        mojito_cmds = meta.mojito && meta.mojito.commands;

    if (bundled.hasOwnProperty(cmd)) {
        log.debug('runnning bundled command %s', cmd);
        mod = load(bundled[cmd]);
        mod(args, opts, meta, cb);

    } else if (mojito_cmds && mojito_cmds.indexOf(cmd)) {
        log.debug('runnning legacy mojito command %s', cmd);
        mod = load(resolve(mojito_cmds.path, cmd));
        mod.run(args, opts, cb);

    } else {
        log.error('Unable to execute command %s', cmd);
    }
}

function main(argv, cwd, cb) {
    var opts = nopt(options, aliases, argv || [], 0),
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
    'info': './commands/info',
    'version': './commands/version',
    'validate': './commands/validate'
};

module.exports = main;
module.exports.log = log;
module.exports.load = load;
module.exports.getmeta = getmeta;

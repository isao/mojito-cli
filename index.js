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


/**
 * @param {string} path of process' current working directory
 * @return {object} combined cli, app, and mojito metadata
 */
function getmeta(cwd) {
    var isme = cwd === __dirname,
        cli = readpkg(__dirname),
        app = !isme && readpkg(cwd),
        mojito = app && readpkg.mojito(cwd);

    // save list of bundled commands for help
    cli.commands = Object.keys(bundled);

    return {
        cli: cli,
        app: app,
        mojito: mojito
    };
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

function loadModule(str, cmd) {
    var mod;
    try {
        // require module by pathname, or by bundled command name
        mod = require(str || bundled[cmd]);
    } catch(err) {
        log.debug('unable to require %s', str || bundled[cmd]);
    }
    return mod;
}

/**
 * @param {string} sub-command, like 'help', 'create', etc.
 * @param {object} cli, app, and mojito, metadata
 * @return {object|function} module loaded via `require`
 */
function getModule(cmd, meta) {
    var mod = false,
        mo_cmd_list = meta.mojito && meta.mojito.commands,
        mo_cmd_path = mo_cmd_list && meta.mojito.commandsPath;

    if (bundled.hasOwnProperty(cmd)) {
        mod = loadModule(bundled[cmd]);

    } else if (mo_cmd_list && (mo_cmd_list.indexOf(cmd) > -1)) {
        mod = loadModule(resolve(mo_cmd_path, cmd));
    }

    return mod;
}

function exec(cmd, args, opts, meta, cb) {
    var mod = getModule(cmd, meta);

    if ('function' === typeof mod) {
        log.debug('getting bundled command %s', cmd);
        mod(args, opts, meta, cb);

    } else if (('object' === typeof mod) && ('run' in mod)) {
        log.debug('runnning legacy mojito command %s', cmd);
        mod.run(args, opts, cb);

    } else {
        cb('Unable to invoke command ' + cmd);
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
    'info': './commands/info',
    'version': './commands/version'
};

module.exports = main;
module.exports.log = log;
module.exports.load = loadModule;

/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
'use strict';

var resolve = require('path').resolve,
    log = require('./lib/log'),
    getopts = require('./lib/getopts'),
    readpkg = require('./lib/readpkg'),

    options = {
        'help': Boolean,
        'version': Boolean,
        'debug': Boolean,
        'context': String,
        'directory': String,
        'keyval': String,
        'name': String,
        'port': Number
    },
    aliases = {h: '--help', v: '--version', d: '--debug', p: '--port'},
    bundled = { // map of package name:require-string
        'create': 'mojito-create',
        'help': './commands/help',
        'info': './commands/info',
        'version': './commands/version'
    };


function tryRequire(str) {
    var mod = false;
    try {
        mod = require(str);
        log.debug('required %s', str);
    } catch(err) {
        log.debug('unable to require %s', str);
    }
    return mod;
}

/**
 * @param {string} sub-command, like 'help', 'create', etc.
 * @param {object} cli, app, and mojito, metadata
 * @return {object|function} module loaded via `require`
 */
function load(cmd, env) {
    var mod = false,
        mo_cmd_list = env.mojito && env.mojito.commands,
        mo_cmd_path = mo_cmd_list && env.mojito.commandsPath;

    if (env.cli.commands.hasOwnProperty(cmd)) {
        mod = tryRequire(bundled[cmd]);

    } else if (mo_cmd_list && (mo_cmd_list.indexOf(cmd) > -1)) {
        // TODO
        // 1. reparse options based on mod.options
        // 2. repopulate env.args & env.opts
        mod = tryRequire(resolve(mo_cmd_path, cmd));
    }

    return mod;
}

function exec(env, cb) {
    var mod = load(env.command, env);

    if (mod && mod.hasOwnProperty('run')) {
        log.debug('runnning legacy mojito command %s', env.command);
        mod.run(env.args, env.opts, cb);

    } else if ('function' === typeof mod) {
        log.debug('getting bundled command %s', env.command);
        mod(env, cb);

    } else {
        cb('Unable to invoke command ' + env.command);
    }
}

function main(argv, cwd, cb) {
    var is_me = cwd === __dirname,
        env = getopts(argv); // {command:'…', args:[…], opts:{…}}

    if (env.opts.debug) {
        log.level = 'debug';
    }

    if (!env.command) {
    	log.error('No command.');
    	env.command = 'help';
    }

    env.cwd = cwd;
    env.cli = readpkg.cli(__dirname);
    env.app = !is_me && readpkg(cwd);
    env.mojito = env.app && readpkg.mojito(cwd);
    env.argv = argv;
    log.debug('env:', env);

    exec(env, cb);
    return env.command;
}


module.exports = main;
module.exports.load = load; // help.js

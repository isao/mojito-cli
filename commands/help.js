/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true */
'use strict';

var resolve = require('path').resolve,
    log = require('../lib/log');


function usage(description) {
    log.info('Usage: mojito <command> [options]');
    log.info(description);
}

function help(meta) {
    var bundled = meta.cli.commands,
        every = meta.mojito ? bundled.concat(meta.mojito.commands) : bundled;

    usage(meta.cli.description);
    log.info('Available commands: %s', every.join(', '));

    if (!meta.mojito) {
        log.info(
            'Additional commands are available from within an application ' +
            'directory that has\nmojito installed.'
        );
    }
}

function main(args, opts, meta, cb) {
    var cmd = args[0],
        mojito_cmds = meta.mojito && meta.mojito.commands;

    if (!cmd || ('help' === cmd)) {
        help(meta);
        cb();

    } else if (meta.cli.commands.indexOf(cmd) > -1) {
        cb(null, module.exports.load(null, cmd).usage);

    } else if (mojito_cmds && (mojito_cmds.indexOf(cmd) > -1)) {
        cb(null, module.exports.load(resolve(mojito_cmds.path, cmd)).usage);

    } else {
        help(meta);
        cb('No help available for command ' + cmd);
    }
}

module.exports = main;
module.exports.log = log;
module.exports.usage = usage;
module.exports.load = require('../').load;

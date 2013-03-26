/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true */
'use strict';

var resolve = require('path').resolve,
    load = require('../').load,
    log = require('../lib/log');


function usage(binname, pkgname) {
    log.info('Usage: %s <command> [options]', binname);
    log.info('The %s package provides command line helpers for mojito developers.', pkgname);
}

function help(meta) {
    var bundled = meta.cli.commands,
        every = meta.mojito ? bundled.concat(meta.mojito.commands) : bundled;

    usage(meta.cli.binname, meta.cli.name);
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

    if (!cmd) {
        help(meta);
        cb();

    } else if(mojito_cmds && (mojito_cmds.indexOf(cmd) > -1)) {
        cb(null, load(resolve(mojito_cmds.path, cmd)).usage);

    } else {
        help(meta);
        cb('No help available for command ' + cmd);
    }
}

module.exports = main;
module.exports.usage = usage;

/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true */
'use strict';

var log = require('../lib/log');


function usage(binname, pkgname) {
    log.info('Usage: %s <command> [options]', binname);
    log.info('The %s package provides command line helpers for mojito developers.', pkgname);
}

function help(args, opts, meta, cb) {
    var basic = meta.cli.commands,
        every = meta.mojito ? basic.concat(meta.mojito.commands) : basic;

    usage(meta.cli.binname, meta.cli.name);
    log.info('Available commands: %s', every.join(', '));
    if (!meta.mojito) {
        log.info(
            'Additional commands are available from within an application ' +
            'directory that has\nmojito installed.'
        );
    }

    cb(null, 'ok');
}

module.exports = help;
module.exports.usage = usage;

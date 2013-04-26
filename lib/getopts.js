/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
'use strict';

var optimist = require('optimist');


function altcmd(opts) {
    var cmd;
    if (opts.version || opts.v) {
        cmd = 'version';
    } else if (opts.help || opts.h) {
        cmd = 'help';
    }
    return cmd;
}

function getopts(parsed) {
    var exclude = {'$0': true, '_': true},
        out = {},
        key;

    for (key in parsed) {
        if (!exclude.hasOwnProperty(key)) {
            out[key] = parsed[key];
        }
    }
    return out;
}

function main(argv) {
    var parsed = optimist.parse(argv),
        args = parsed._,
        opts = getopts(parsed),
        command = (args.shift() || '').toLowerCase();

    // treat lone --help and --version flags like commands
    if (!command) {
        command = altcmd(opts);
    }

    return {
        command: command,
        args: args,
        opts: opts
    };
}

module.exports = main;

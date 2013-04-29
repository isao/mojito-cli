/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
'use strict';

var nopt = require('nopt');


// treat lone --help and --version flags like commands
function alternativeCmd(opts) {
    var cmd = '';
    if (opts.version || opts.v) {
        cmd = 'version';
    } else if (opts.help || opts.h) {
        cmd = 'help';
    }
    return cmd;
}

// lowercase parsed option keys; ignore nopt-specific 'argv' property
function getopts(parsed) {
    var filtered = {}, key;
    for (key in parsed) {
        if ('argv' !== key) {
            filtered[key.toLowerCase()] = parsed[key];
        }
    }
    return filtered;
}

/**
 * @param {array} argv from process.argv.slice(2)
 * @param {object} known options
 * @param {object} alias of known options
 * @return {object} command, args, and options
 *    @param {string} command
 *    @param {array} arguments
 *    @param {object} options
 *    @param {array} original argv
 */
function main(argv, known, alias) {
    var parsed = nopt(known || {}, alias || {}, argv, 0),
        opts = getopts(parsed),
        args = parsed.argv.remain.slice(0),
        orig = parsed.argv.original.slice(0),
        command = args.shift() || alternativeCmd(opts);;

    return {
        command: command.toLowerCase(), // string
        args: args, // array
        opts: opts, // object options
        orig: orig  // array process.argv.slice(2)
    };
}

module.exports = main;

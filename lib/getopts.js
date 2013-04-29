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

// convert mojito options-config to nopt's known and short config objects
function getoptCfg(options) {
    var known = {},
        alias = {'debug': ['--loglevel', 'debug']};

    function forNopt(opt) {
        if ('longName' in opt) {
            known[opt.longName.toLowerCase()] = opt.hasValue ? String : Boolean;
            if ('shortName' in opt) {
                alias[opt.shortName] = '--' + opt.longName;
            }
        }
    }

    options.forEach(forNopt);
    return {
        known: known,
        alias: alias
    };
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
function main(argv, optCfg) {
    var config = getoptCfg(optCfg || []),
        parsed = nopt(config.known, config.alias, argv, 0),
        opts = getopts(parsed),
        args = parsed.argv.remain,
        orig = parsed.argv.original,
        command = args.shift() || alternativeCmd(opts);

    return {
        command: command.toLowerCase(), // string
        args: args, // array
        opts: opts, // object options
        orig: orig  // array process.argv.slice(2)
    };
}

module.exports = main;

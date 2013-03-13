#!/usr/bin/env node
/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */
// todo: replace config-chains from cwd(), ~, defaults
// todo: logging
/*jshint node:true */
'use strict';

var path = require('path'),
    opts = require('optimist').argv,
    pass = require('./passthru'),
    builtin = {
        'help': './help',
        'version': './version',
        'create': 'mojito-create'
    };


function done(err, msg) {
    console[err ? 'error' : 'info'](err || msg);
}

function main(opts, cb) {
    var args = opts._,
        cmd = args.shift();

    // inferred commands
    if(!cmd) {
        if(opts.version) {
            cmd = 'version';
        } else if(opts.help) {
            cmd = 'help';
        } else {
            //console.error('error: no command provided.');
            cmd = 'help';
        }
    }

    if(builtin.hasOwnProperty(cmd)) {
        require(builtin[cmd]).run(args, opts, cb);
    } else {
        pass.run(cmd, args, opts, cb);
    }

    return cmd;
}

if (require.main === module) {
    main(opts, done);
}

module.exports = main;

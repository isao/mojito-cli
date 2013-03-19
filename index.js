/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true */
'use strict';

var optimist = require('optimist'),
    log = require('./log'),
    pass = require('./passthru'),
    info = require('./package.json'),
    builtin;


function main(argv, cb) {
    var opts = optimist.parse(argv),
        args = opts._, // args without "-" or "--" prefixes, or after bare "--"
        cmd = args.shift();

    // commands inferred from options
    if(!cmd) {
        if(opts.version) {
            cmd = 'version';
        } else if(opts.help) {
            cmd = 'help';
        } else {
            log.error('Missing command parameter.');
            cmd = 'help';
        }
    }

    // dispatch the command
    if(builtin.hasOwnProperty(cmd)) {
        if('string' === typeof builtin[cmd]) {
            require(builtin[cmd]).run(args, opts, cb);
        } else {
            builtin[cmd](args, opts, cb);
        }
    } else {
        pass.run(cmd, args, opts, cb);
    }

    return cmd;
}

function help(args, opts, cb) {
    cb(null, [
        'Usage: ', Object.keys(info.bin)[0], ' <command> [options]\n',
        'Commands: help, version, create' // FIXME
    ].join(''));
}

function version(args, opts, cb) {
    cb(null, info.name + ' v' + info.version);
}

builtin = {
    //command -> require string or function
    'create': 'mojito-create',
    'help': help,
    'version': version
};

module.exports = {
    run: main,
    log: log,
    name: info.name,
    version: info.version
};

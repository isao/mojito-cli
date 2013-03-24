/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true */
'use strict';

var log = require('./log'),
    resolve = require('path').resolve;


function load(pathname) {
    var mod;
    try {
        mod = require(pathname);
    } catch(err) {
    }
    return mod;
}

function legacy(cmd, meta, opts, cb) {
    var mod = load(pathname),
        pathname = resolve(meta.mojito.commands.path, cmd);

    if (mod) {
        log.debug('delegating to %s/%s', meta.mojito.commands.path, cmd);
        mod(opts.remain, opts, cb);
    } else {
        cb('Failed to load module %s', pathname);
    }
    return;
}

function main(pathname, meta, opts, cb) {
    var mod = load(pathname);

    if (mod) {
        mod(meta, opts, cb);
    } else {
        cb('Failed to load module %s', pathname);
    }
    return;
}

module.exports = main;
module.exports.load = load;
module.exports.legacy = legacy;
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
    	log.error('Failed to load module %s', pathname);
    }
    return mod;
}

function main(pathname, meta, opts, cb) {
    load(pathname)(meta, opts, cb);
    return;
}

function loadHelp(mojito_cmd, meta, opts, cb) {
    var pathname = resolve(meta.mojito.commands.path, mojito_cmd);
}

module.exports = main;
module.exports.load = load;

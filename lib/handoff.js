/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true */
'use strict';

var log = require('./log'),
    resolve = require('path').resolve;


function main(pathname, meta, opts, cb) {
    require(pathname)(meta, opts, cb);
    return;
}

function loadHelp(mojito_cmd, meta, opts, cb) {
    var pathname = resolve(meta.mojito.commands.path, mojito_cmd);
}

function load(pkg_name, opts, cb) {
    require(pkg_name).run(opts.argv.remain, opts, cb);
}

module.exports = main;
module.exports.load = load;

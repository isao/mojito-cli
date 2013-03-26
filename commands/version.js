/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true */
'use strict';

var log = require('../lib/log');


function version(args, opts, meta, cb) {
    log.info('%s v%s', meta.cli.name, meta.cli.version);
    cb(null, 'ok');
}

module.exports = version;

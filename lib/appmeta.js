/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */

var resolve = require('path').resolve,
    readdir = require('fs').readdirSync,
    log = require('./log'),

    MOJDIR = 'node_modules/mojito';


function apppkg(cwd) {
    var path = resolve(cwd, 'package'),
        meta = false;

    try {
        meta = require(path);
        meta.dependencies = meta.dependencies || {},
        meta.devDependencies = meta.devDependencies || {}
        log.debug('%s v%s found at %s', meta.name, meta.version, cwd);

    } catch(ignore) {
        log.debug('NO package.json found at %s', cwd);
    }

    return meta;
}

function main(cwd) {
    var meta = apppkg(cwd);
    return meta;
}

module.exports = main;

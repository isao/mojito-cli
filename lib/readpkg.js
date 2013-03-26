/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */

var resolve = require('path').resolve,
    readdir = require('fs').readdirSync,
    log = require('./log');


function readpkg(cwd) {
    var path = resolve(cwd, 'package'),
        isme = resolve(__dirname, '../package'),
        meta = false;

    if (path === isme) {
        log.debug('own package.json, skipping');

    } else {
        try {
            meta = require(path);
            log.debug('%s v%s found at %s', meta.name, meta.version, cwd);

        } catch(ignore) {
            log.debug('no package.json found at %s', cwd);
        }
    }

    return meta && {
        name: meta.name,
        path: cwd,
        version: meta.version,
        dependencies: meta.dependencies || {}
    };
}

module.exports = readpkg;

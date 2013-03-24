/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true */
'use strict';

var log = require('../lib/log');


function version(meta, opts, cb) {
    var appdeps = meta.app && meta.app.dependencies;

    log.info('%s v%s', meta.cli.name, meta.cli.version);

    if (appdeps) {
        log.info('%s v%s', meta.app.name, meta.app.version);
        if (appdeps && appdeps.mojito) {
            log.info('%s dependencies: %s', meta.app.name, Object.keys(appdeps).join(', '));
        } else {
            log.warn('Mojito is not listed as a dependency in your package.json. Fix with:');
            log.warn('    npm install mojito --save');
            log.warn('');
        }
    }

    if (meta.mojito) {
        log.info('%s v%s (installed locally)', meta.mojito.name, meta.mojito.version);
    }
}

module.exports = version;

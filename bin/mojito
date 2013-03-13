#!/usr/bin/env node
/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */

require('../')(process.argv.slice(2), function done(err, msg) {
    console[err ? 'error' : 'info'](err || msg);
});

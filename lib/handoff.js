/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */

var log = require('./log'),
    resolve = require('path').resolve,
    clipath = 'node_modules/mojito/lib/management/cli.js';


function main(mojito_cmd, meta, opts, cb) {
    var pathname = resolve(meta.mojito.commands.path, mojito_cmd);
    require(pathname).run(opts.argv.remain, opts, cb);
}

function load(pkg, opts, cb) {
    require(pkg).run(opts.argv.remain, opts, cb);
}

module.exports = main;
module.exports.require = load;
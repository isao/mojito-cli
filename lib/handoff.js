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

function load(module_name, opts, cb) {
	require(mojito_cmd).run(opts.argv.remain, opts, cb);
}

function shell(shell_cmd, opts, env) {
    //TODO pre-check w/which
    //TODO spawn
    env.MOJITO_CLI = __filename;

	log.info(shell_cmd, opts);
}

module.exports = main;
module.exports.require = load;
module.exports.shell = shell;
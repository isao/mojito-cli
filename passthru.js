/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */

var clipath = 'node_modules/mojito/lib/management/cli.js',
    path = require('path');

function isMojitoApp(dir) {
    var pkg = {},
        ok = false;

    try {
        pkg = require(path.resolve(dir, 'package.json'));
    } catch(err) {
    }

    ok = pkg.dependencies && pkg.dependencies.mojito;
    //todo: chk for installed mojito too
    //if(ok) {
    //
    //}
    return ok;
}

function run(mojito_cmd, args, opts, cb) {
    var cli;
    cli = opts.cliMock || require(path.resolve(clipath));
    cli.run([mojito_cmd].concat(args), opts, cb);
}

module.exports = {
    run: run,
    isMojitoApp: isMojitoApp
};
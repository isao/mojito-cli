/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */

var resolve = require('path').resolve,
    clipath = 'node_modules/mojito/lib/management/cli.js';

function isMojitoApp(dir) {
    var pkg = {},
        ok = false;

    try {
        pkg = require(resolve(dir, 'package.json'));
        ok = pkg.dependencies && pkg.dependencies.mojito && true;
    } catch(err) {
    }

    return ok;
}

function run(cmd, args, opts, cb) {
    var oldcli,
        appdir = opts.cwd || process.cwd();

    if(!isMojitoApp(appdir)) {
        cb('Not in a mojito application directory (no ./package.json:dependencies.mojito)');
        return;
    }

    try {
        oldcli = require(resolve(clipath));
        oldcli.run([cmd].concat(args), cb);
    } catch(err) {
        cb('Unable to invoke command "' + cmd + '"'); // todo: use err obj
    }

    return oldcli;
}

function setpath(newpath) {
    var oldpath = clipath;
    clipath = newpath;
    return oldpath;
}

module.exports = {
    run: run,
    isMojitoApp: isMojitoApp,
    setpath: setpath
};

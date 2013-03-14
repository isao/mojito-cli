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
        ok = pkg.dependencies && pkg.dependencies.mojito;
    } catch(err) {
    }

    //todo: verify that the filesystem contains mojito app-like stuff
    //if(ok) {
    //
    //}
    return ok;
}

function run(cmd, args, opts, cb) {
    var oldcli;
    //isMojitoApp(?);
    try {
        oldcli = require(resolve(clipath));
        oldcli.run([cmd].concat(args), cb);
    } catch(err) {
        cb('unable to invoke command "' + cmd + '"'); // todo: use err obj
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

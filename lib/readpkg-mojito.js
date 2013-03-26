/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */

var resolve = require('path').resolve,
    readdir = require('fs').readdirSync,
    log = require('./log'),

    readpkg = require('./readpkg'),
    MOJDIR = 'node_modules/mojito',
    MOJCMD = 'lib/app/commands';


function cmdname(file) {
    return file.split('.')[0];
}

function mojcmds(cwd, meta) {
    var path = resolve(cwd, MOJDIR, MOJCMD),
        list = readdir(path).map(cmdname);

    list.path = path;
    log.debug(MOJCMD + ':', list.join(', '));
    return list;
}

function main(cwd) {
    var meta = readpkg(resolve(cwd, MOJDIR));

    if (meta) {
        meta.commands = mojcmds(cwd);
    }

    return meta;
}

module.exports = main;

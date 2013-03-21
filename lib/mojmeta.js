/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */

var resolve = require('path').resolve,
    readdir = require('fs').readdirSync,
    log = require('./log'),

    MOJDIR = 'node_modules/mojito',
    MOJCMD = 'lib/app/commands';


function mojpkg(cwd) {
    var path = resolve(cwd, MOJDIR, 'package'),
        meta = false;

    try {
        meta = require(path);
        log.debug('%s v%s found at %s', meta.name, meta.version, cwd);

    } catch(ignore) {
        log.debug('NO package.json found at %s', cwd);
    }

    return meta && {
        name: meta.name,
        version: meta.version,
        commands: meta.commands
    };
}

function cmdname(file) {
    return file.split('.')[0];
}

function mojcmds(cwd) {
    var path = resolve(cwd, MOJDIR, MOJCMD),
        list = readdir(path).map(cmdname).sort();

    log.debug('mojito commands:', list.join(', '));
    return list;
}

function main(cwd) {
    var meta = mojpkg(cwd);

    if (meta) {
        meta.commands = mojcmds(cwd);
    }

    return meta;
}

module.exports = main;

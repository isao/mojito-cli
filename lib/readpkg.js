/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true */
'use strict';

var resolve = require('path').resolve,
    readdir = require('fs').readdirSync,
    log = require('./log'),

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

function readMojito(cwd) {
    var path = resolve(cwd, MOJDIR),
        meta = read(path);

    if (meta) {
        meta.path = path;
        meta.commands = mojcmds(cwd);
    }

    return meta;
}

function read(cwd) {
    var path = resolve(cwd, 'package'),
        meta = false;

    try {
        meta = require(path);
        log.debug('%s v%s found at %s', meta.name, meta.version, cwd);

    } catch(ignore) {
        log.debug('no package.json found at %s', cwd);
    }

    return meta && {
        name: meta.name,
        path: cwd,
        version: meta.version,
        description: meta.description || '(missing description)',
        dependencies: meta.dependencies || {}
    };
}

module.exports = read;
module.exports.mojito = readMojito;

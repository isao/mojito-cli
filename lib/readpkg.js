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

function readMojito(cwd) {
    var path = resolve(cwd, MOJDIR),
        meta = read(path);

    if (meta) {
        // additional metadata for locally installed mojito package
        meta.path = path;
        meta.commandsPath = resolve(path, MOJCMD);
        meta.commands = readdir(meta.commandsPath).map(cmdname);
        log.debug(MOJCMD + ':', meta.commands.join(', '));
    }

    return meta;
}

/**
 * read package.json and return a subset of the data
 * @param {string} directory path
 * @return {object|false}
 */
function read(cwd) {
    var path = resolve(cwd, 'package.json'),
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

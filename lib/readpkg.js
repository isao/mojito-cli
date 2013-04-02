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
    MOJCMD = 'lib/app/commands',
    MOJSCHEMA = 'schemas';


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

function schemas(file) {
    return {
        'name': file.split('.')[0],
        'path': file
    };
}

function mojschemas(cwd) {
    var path = resolve(cwd, MOJDIR, MOJSCHEMA),
        list = [];

    try {
        list = readdir(path).map(schemas);
        list.path = path;
    } catch (e) {
        // in case there is no schemas folder in the local mojito
        log.debug('no schemas found at %s', path);
    }

    return list;
}

function readMojito(cwd) {
    var path = resolve(cwd, MOJDIR),
        meta = read(path);

    if (meta) {
        meta.path = path;
        meta.commands = mojcmds(cwd);
        meta.schemas = mojschemas(cwd);
    }

    return meta;
}

function read(cwd) {
    var path = resolve(cwd, 'package'),
        isme = resolve(__dirname, '../package'),
        meta = false;

    if (path === isme) {
        log.debug('own package.json, skipping');

    } else {
        try {
            meta = require(path);
            log.debug('%s v%s found at %s', meta.name, meta.version, cwd);

        } catch(ignore) {
            log.debug('no package.json found at %s', cwd);
        }
    }

    return meta && {
        name: meta.name,
        path: cwd,
        version: meta.version,
        description: meta.description || '',
        dependencies: meta.dependencies || {}
    };
}

module.exports = read;
module.exports.mojito = readMojito;

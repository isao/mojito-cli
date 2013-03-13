/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

function run(args, opts, cb) {
	var pkg = require('./package');
	cb(null, [pkg.name, ' v', pkg.version].join(''));
}

module.exports.run = run;
module.exports.usage = '.';
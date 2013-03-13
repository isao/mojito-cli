/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */

function run(args, opts, cb) {
	var pkg = require('./package'),
	    out = [pkg.name, ' v', pkg.version].join('');

	cb(null, out);
}

module.exports = {
	run: run,
	usage: 'fixme'
}

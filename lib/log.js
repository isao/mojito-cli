var log = require('npmlog');

// monkey patch npmlog…
log.heading = '';
log.headingStyle.fg = 'blue';
log.disp.error = 'err!';
log.disp.warn = 'warn';
log.style.error.bold = true;

// no bg colors
log.headingStyle.bg =
log.style.verbose.bg =
log.style.warn.bg =
log.style.error.bg =
log.style.http.bg = null;

// disable prefixing
Object.keys(log.levels).forEach(function(level) {
	log[level] = log[level].bind(log, '');
});

module.exports = log;

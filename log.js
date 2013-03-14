var log = require('npmlog');

log.heading = '';
log.headingStyle.fg = 'blue';
log.style.error.bold = true;

log.headingStyle.bg =
log.style.verbose.bg =
log.style.warn.bg =
log.style.error.bg =
log.style.http.bg = null;

module.exports = log;

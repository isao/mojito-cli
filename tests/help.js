var test = require('tap').test,
    help = require('../commands/help'),
    log = help.log;


// buffer log msgs instead of outputing them
log.pause();

function getMeta() {
    return {
        cli: {
            name: 'mojito-cli',
            version: '1.2.3',
            commands: ['create', 'help', 'info', 'version']
        }
    };
}

function reset() {
    log.record = [];
    log._buffer = [];
}

test('help exports', function(t) {
    t.equal('function', typeof help);
    t.equal('function', typeof help.usage);
    t.end();
});

test('help simple', function(t) {
    function cb(err, msg) {
        t.equals(err, undefined);
        t.equals(log.record.shift().message, 'Usage: undefined <command> [options]');
        t.equals(log.record.shift().message, 'The mojito-cli package provides command line helpers for mojito developers.');
        t.equals(log.record.shift().message, 'Available commands: create, help, info, version');
        t.equals(log.record.shift().message, 'Additional commands are available from within an application directory that has\nmojito installed.');
        t.equals(log.record.length, 0);
        t.end();
    }

    reset();
    help([], {}, getMeta(), cb);
});
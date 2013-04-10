var test = require('tap').test,
    help = require('../commands/help'),
    log = help.log,
    old_load = help.load;


// buffer log msgs instead of outputing them
log.pause();

function getMeta() {
    return {
        cli: {
            name: 'mojito-cli',
            version: '1.2.3',
            commands: ['create', 'help', 'info', 'version', 'make-it-rain'],
            description: 'whoop whoop'
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
        t.equals(log.record.shift().message, 'Usage: mojito <command> [options]');
        t.equals(log.record.shift().message, 'whoop whoop');
        t.equals(log.record.shift().message, 'Available commands: create, help, info, version, make-it-rain');
        t.equals(log.record.shift().message, 'Additional commands are available from within an application directory that has\nmojito installed.');
        t.equals(log.record.length, 0);
        t.end();
    }

    reset();
    help([], {}, getMeta(), cb);
});

test('help bundled command', function(t) {

    t.plan(3);

    function load(str, cmd) {
    	t.equals(cmd, 'make-it-rain');
    	help.load = old_load;
    	return {
    	    usage: cmd + ' does this and that' 
    	};
    }

    function cb(err, msg) {
        t.equals(err, null);
        t.equals(msg, 'make-it-rain does this and that');
    }

    reset();
    help.load = load;
    help(['make-it-rain'], {}, getMeta(), cb);
});

test('help nonesuch', function(t) {
    t.plan(2);

    function cb(err, msg) {
        t.equals(err, 'No help available for command nonesuch');
        t.equals(msg, undefined);
    }

    reset();
    help(['nonesuch'], {}, getMeta(), cb);
});

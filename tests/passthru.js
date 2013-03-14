var test = require('tape'),
    optimist = require('optimist'),
    pass = require('../passthru'),

    resolve = require('path').resolve,
    fakecli = 'fixtures/someapp/node_modules/mojito/lib/management/cli.js',
    testpath = resolve(__dirname, fakecli);


test('someapp jslint', function(t) {
    t.plan(1);

    function cb(err, msg) {
        t.equal(msg, 'you want me to jslint?');
    }

    var oldpath = pass.setpath(testpath);
    pass.run('jslint', ['app'], {}, cb);
    pass.setpath(oldpath);
});

test('cwd is not a mojito app dir', function(t) {
    t.notOk(pass.isMojitoApp('.'));
    t.end();
});

test('fail case', function(t) {
    t.plan(2);

    function cb(err, msg) {
        t.equal(err, 'unable to invoke command jslint');
    }

    var result = pass.run('jslint', ['hey booboo'], {}, cb);
    t.notOk(result)
});

var pass = require('../passthru'),
    resolve = require('path').resolve,
    fakecli = 'fixtures/someapp/node_modules/mojito/lib/management/cli.js',
    testpath = resolve(__dirname, fakecli),
    appdir = resolve(__dirname, 'fixtures/someapp');


exports['someapp jslint'] = function(t) {
    t.expect(1);

    function cb(err, msg) {
        t.equal(msg, 'you want me to jslint?');
    }

    var oldpath = pass.setpath(testpath);
    pass.run('jslint', ['app'], {cwd:appdir}, cb);

    pass.setpath(oldpath);
    t.done();
};

exports['cwd is not a mojito app dir'] = function(t) {
    t.ok(!pass.isMojitoApp('.'));
    t.done();
};

// exports['fail case'] = function(t) {
//     t.expect(2);
// 
//     function cb(err, msg) {
//         t.equal(err, 'unable to invoke command "jslint"');
//     }
// 
//     var result = pass.run('jslint', ['hey booboo'], {}, cb);
//     t.ok(!result)
//     t.done();
// };

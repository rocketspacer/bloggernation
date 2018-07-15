/* GLOBAL SETTINGS */

before(function(done) {
    console.log('before hook executed');
    done();
});

after(function(done) {
    console.log('after hook executed');
    done();
});
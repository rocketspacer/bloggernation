before(function(done) {
    //Connect to Mock DB instead of real DB
    console.log('before hook executed');
    done();
});

after(function(done) {
    console.log('after hook executed');
    done();
});
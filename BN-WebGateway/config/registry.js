//------------------------------------------------------------------------
// Node Dependencies
// var os = require('os');
// var ifaces = os.networkInterfaces();

//------------------------------------------------------------------------
// External Dependencies
var shortid = require('shortid');
var consul = require('consul')();
var async = require('async');

//------------------------------------------------------------------------
// DNS Configurations
var dns = require('dns');
dns.setServers(['127.0.0.1']);

//------------------------------------------------------------------------
// Config Object
var configObject = {

    // Registering
    register: function (done) {
        async.waterfall([
            function (next) {
                consul.agent.self((err, agent) => {
                    if (err) return next(err);
                    next(null, agent.Config.AdvertiseAddr);
                });
            },
            function (agentAddr, next) {
                consul.agent.service.list((err, services) => {
                    if (err) return next(err);

                    var overrides = false;

                    // Finding duplicated services
                    var duplicatedServices = [];
                    for (let sId in services) {
                        var sv = services[sId];
                        if (sv.ID === Configs.SERVICE_ID)
                            overrides = true;
                        else if (sv.Address === agentAddr && sv.Port === Configs.PORT)
                            duplicatedServices.push(sv);
                    }

                    // If no duplicates
                    if (duplicatedServices.length === 0) {
                        if (overrides) console.log('Exists a service using the same ID <', Configs.SERVICE_ID, '>, registering new service will override the old one');
                        return next(null, agentAddr);
                    }

                    // Preparing to deregister duplicated services
                    console.log('Duplicate services found:', duplicatedServices.map((sv) => sv.ID));
                    var deregisterTasks = duplicatedServices.map((sv) => {
                        return function (cb) {
                            consul.agent.service.deregister(sv.ID, (err) => {
                                if (err) console.log('Error deregistering duplicated service', sv.ID, err);
                                else console.log('Duplicate service deregistered:', sv.ID);
                                cb();
                            });
                        };
                    });

                    async.parallel(
                        deregisterTasks,
                        () => {
                            if (overrides) console.log('Exists a service using the same ID <', Configs.SERVICE_ID, '>, registering new service will override the old one');
                            next(null, agentAddr);
                        });
                });
            },
            function (agentAddr, next) {
                consul.agent.service.register({
                    id: Configs.SERVICE_ID,
                    name: Configs.SERVICE_NAME,
                    address: agentAddr,
                    port: Configs.PORT,
                    tags: Configs.SERVICE_TAGS,
                    checks: [
                        {
                            name: 'ping',
                            http: 'http://' + agentAddr + ':' + Configs.PORT + Configs.PING_PATH,
                            timeout: Configs.PING_TIMEOUT,
                            interval: Configs.PING_INTERVAL,
                            deregistercriticalserviceafter: Configs.REGISTRY_TIMEOUT
                        }
                    ]
                }, (err) => {
                    if (err) return next(err);
                    next(null, Configs.SERVICE_ID);
                });
            }
        ], (err, serviceId) => {
            if (err) return done(err);
            done(null, serviceId);
        });
    },

    // Deregistering
    deregister: function (done) {
        consul.agent.service.deregister(Configs.SERVICE_ID, (err) => {
            if (err) return done(err);
            done(null, Configs.SERVICE_ID);
        });
    },

    // Resolving service
    resolveService: function (serviceName, done) {
        async.parallel({
            IP: function (cb) {
                dns.resolve(serviceName + '.service.consul', 'A', (err, records) => {
                    if (err) return cb(err);
                    cb(null, records[0]);
                });
            },
            PORT: function (cb) {
                dns.resolve(serviceName + '.service.consul', 'SRV', (err, records) => {
                    if (err) return cb(err);
                    cb(null, records[0].port);
                });
            }
        }, (err, result) => {
            if (err) return done(err);
            done(null, result);
        });
    }
};

//------------------------------------------------------------------------
// Exports
module.exports = configObject;
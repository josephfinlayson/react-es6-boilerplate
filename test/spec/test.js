var test = require('tape');
// import {idFetcher} from './../../app/scripts/services/httpServices'

test('Check if http service is instantiated', function (t) {
    t.plan(1);
    t.equal(typeof idFetcher, 'function');
});




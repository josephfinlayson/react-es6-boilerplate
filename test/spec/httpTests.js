import helper from './test-helper'
import videoIdService from './../../app/scripts/services/httpServices'

var test = require('tape')
console.log(videoIdService)
test('Check if http service exists', function(t) {
    t.plan(1);
    t.equal(typeof videoIdService, 'function');
});

test('Check if http service returns an object', function(t) {
    t.plan(1)
        // console.log(videoIdService())
    videoIdService()
        .then(function(object) {
            t.equal(typeof object, 'object');
        })
});

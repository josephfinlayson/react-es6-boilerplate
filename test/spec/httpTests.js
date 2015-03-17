import helper from './test-helper'
import {
    videoIdService, lastFmHistory
}
from './../../app/scripts/services/httpServices'

var test = require('tape')


test('Check if http service exists', function(t) {
    t.plan(1);
    t.equal(typeof videoIdService, 'function');
});

test('Check if http service returns an object', function(t) {
    t.plan(4)
    videoIdService()
        .then(function(object) {
            t.equal(typeof object, 'object');
            t.equal(typeof object.fullTitle, 'string');
            t.equal(typeof object.videoId, 'string');
            t.ok(object.fullTitle.indexOf('Neil') !== -1, "contains the word Neil");
        })
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../src/index");
var chai_1 = require("chai");
describe('#init()', function () {
    this.timeout(10000);
    it('should init spotilocal', function (done) {
        var spotilocal = new index_1.Spotilocal();
        spotilocal.init().then(function () { done(); }).catch(done);
    });
});
describe('#getStatus()', function () {
    this.timeout(10000);
    it('should fail if not initialized', function (done) {
        var spotilocal = new index_1.Spotilocal();
        spotilocal.getStatus().then(function () {
            done('Should have failed');
        }).catch(function (error) {
            chai_1.assert.strictEqual(error, index_1.SPOTILOCAL_IS_NOT_INITIALIZED);
            done();
        }).catch(function (error) {
            done(error);
        });
    });
    it('should get status from spotilocal if initialized', function (done) {
        var spotilocal = new index_1.Spotilocal();
        spotilocal.init().then(function (spotilocal) {
            return spotilocal.getStatus();
        }).then(function (_status) {
            done();
        }).catch(done);
    });
});
describe('#pause()', function () {
    this.timeout(10000);
    it('should fail if not initialized', function (done) {
        var spotilocal = new index_1.Spotilocal();
        spotilocal.pause(true).then(function () {
            done('Should have failed');
        }).catch(function (error) {
            chai_1.assert.strictEqual(error, index_1.SPOTILOCAL_IS_NOT_INITIALIZED);
            done();
        }).catch(function (error) {
            done(error);
        });
    });
    it('should get status from spotilocal if initialized', function (done) {
        var spotilocal = new index_1.Spotilocal();
        spotilocal.init().then(function (spotilocal) {
            return spotilocal.pause(true);
        }).then(function (_status) {
            done();
        }).catch(done);
    });
});
describe('#play()', function () {
    this.timeout(10000);
    it('should fail if not initialized', function (done) {
        var spotilocal = new index_1.Spotilocal();
        spotilocal.play('spotify:track:23r4eXV6ziw0NNznZU9NiC', 'spotify:user:shyyko.serhiy:playlist:4SdN0Re3tJg9uG08z2Gkr1').then(function () {
            done('Should have failed');
        }).catch(function (error) {
            chai_1.assert.strictEqual(error, index_1.SPOTILOCAL_IS_NOT_INITIALIZED);
            done();
        }).catch(function (error) {
            done(error);
        });
    });
    it('should play song wihtout context and return correct status', function (done) {
        var spotilocal = new index_1.Spotilocal();
        var trackUri = 'spotify:track:53zHrgxt8Xy1RkMWepJVUh';
        spotilocal.init().then(function (spotilocal) {
            return spotilocal.play(trackUri);
        }).then(function (status) {
            chai_1.assert.strictEqual(status.playing, true);
            chai_1.assert.strictEqual(status.track.track_resource.uri, trackUri);
            chai_1.assert.strictEqual(status.track.track_resource.name, 'Insane');
            done();
        }).catch(done);
    });
    it('should play song in context and return correct status', function (done) {
        var spotilocal = new index_1.Spotilocal();
        var trackUri = 'spotify:track:7H2zem6ynyk67mqqXDIwDS';
        spotilocal.init().then(function (spotilocal) {
            return spotilocal.play(trackUri, 'spotify:user:shyyko.serhiy:playlist:4SdN0Re3tJg9uG08z2Gkr1');
        }).then(function (status) {
            chai_1.assert.strictEqual(status.playing, true);
            chai_1.assert.strictEqual(status.track.track_resource.uri, trackUri);
            chai_1.assert.strictEqual(status.track.track_resource.name, 'Creature Fear');
            done();
        }).catch(done);
    });
});
describe('#play() and #pause()', function () {
    this.timeout(10000);
    it('should play song pause it and resume it', function (done) {
        var spotilocal = new index_1.Spotilocal();
        var trackUri = 'spotify:track:23r4eXV6ziw0NNznZU9NiC';
        spotilocal.init().then(function (spotilocal) {
            return spotilocal.play(trackUri, 'spotify:user:shyyko.serhiy:playlist:4SdN0Re3tJg9uG08z2Gkr1');
        }).then(function (status) {
            chai_1.assert.strictEqual(status.playing, true);
            chai_1.assert.strictEqual(status.track.track_resource.uri, trackUri);
            return spotilocal.pause(true);
        }).then(function (status) {
            chai_1.assert.strictEqual(status.playing, false);
            chai_1.assert.strictEqual(status.track.track_resource.uri, trackUri);
            return spotilocal.pause(false);
        }).then(function (status) {
            chai_1.assert.strictEqual(status.playing, true);
            chai_1.assert.strictEqual(status.track.track_resource.uri, trackUri);
            return spotilocal.pause(true);
        }).then(function (status) {
            chai_1.assert.strictEqual(status.playing, false);
            chai_1.assert.strictEqual(status.track.track_resource.uri, trackUri);
            done();
        }).catch(done);
    });
});
describe('#getStatus() with returnOn', function () {
    this.timeout(10000);
    var returnOn = ['play', 'pause'];
    it('should fail if not initialized', function (done) {
        var spotilocal = new index_1.Spotilocal();
        spotilocal.getStatus(returnOn).then(function () {
            done('Should have failed');
        }).catch(function (error) {
            chai_1.assert.strictEqual(error, index_1.SPOTILOCAL_IS_NOT_INITIALIZED);
            done();
        }).catch(function (error) {
            done(error);
        });
    });
    it('should get status from spotilocal if initialized', function (done) {
        var spotilocal = new index_1.Spotilocal();
        var start = 0;
        spotilocal.init().then(function (spotilocal) {
            start = +new Date();
            setTimeout(function () {
                spotilocal.play('spotify:track:23r4eXV6ziw0NNznZU9NiC', 'spotify:user:shyyko.serhiy:playlist:4SdN0Re3tJg9uG08z2Gkr1');
            }, 1000);
            return spotilocal.getStatus(returnOn);
        }).then(function (status) {
            chai_1.assert.strictEqual(status.playing, true);
            chai_1.assert.isAbove(+new Date() - start, 1000);
            done();
        }).catch(done);
    });
});

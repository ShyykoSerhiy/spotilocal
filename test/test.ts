import {Spotilocal, SPOTILOCAL_IS_NOT_INITIALIZED} from '../src/index';
import {assert} from 'chai';

describe('#init()', function () {
    this.timeout(10000);
    it('should init spotilocal', function (done) {
        const spotilocal = new Spotilocal();
        spotilocal.init().then(() => { done(); }).catch(done);
    });
});

describe('#getStatus()', function () {
    this.timeout(10000);
    it('should fail if not initialized', function (done) {
        const spotilocal = new Spotilocal();
        spotilocal.getStatus().then(() => {
            done('Should have failed');
        }).catch((error) => {
            assert.strictEqual(error, SPOTILOCAL_IS_NOT_INITIALIZED);
            done();
        }).catch((error) => {
            done(error);
        });
    });

    it('should get status from spotilocal if initialized', function (done) {
        const spotilocal = new Spotilocal();
        spotilocal.init().then((spotilocal) => {
            return spotilocal.getStatus()
        }).then((status) => {
            done();
        }).catch(done);
    });
});

describe('#pause()', function () {
    this.timeout(10000);
    it('should fail if not initialized', function (done) {
        const spotilocal = new Spotilocal();
        spotilocal.pause(true).then(() => {
            done('Should have failed');
        }).catch((error) => {
            assert.strictEqual(error, SPOTILOCAL_IS_NOT_INITIALIZED);
            done();
        }).catch((error) => {
            done(error);
        });
    });

    it('should get status from spotilocal if initialized', function (done) {
        const spotilocal = new Spotilocal();
        spotilocal.init().then((spotilocal) => {
            return spotilocal.pause(true)
        }).then((status) => {
            done();
        }).catch(done);
    });
});

describe('#play()', function () {
    this.timeout(10000);
    it('should fail if not initialized', function (done) {
        const spotilocal = new Spotilocal();
        spotilocal.play('spotify:track:3cANM3NuUjRDTi8fdU8P6q', 'spotify:user:shyyko.serhiy:playlist:4SdN0Re3tJg9uG08z2Gkr1').then(() => {
            done('Should have failed');
        }).catch((error) => {
            assert.strictEqual(error, SPOTILOCAL_IS_NOT_INITIALIZED);
            done();
        }).catch((error) => {
            done(error);
        });
    });

    it('should play song wihtout context and return correct status', function (done) {
        const spotilocal = new Spotilocal();
        const trackUri = 'spotify:track:53zHrgxt8Xy1RkMWepJVUh';
        spotilocal.init().then((spotilocal) => {
            return spotilocal.play(trackUri)
        }).then((status) => {
            assert.strictEqual(status.playing, true);
            assert.strictEqual(status.track.track_resource.uri, trackUri);
            assert.strictEqual(status.track.track_resource.name, 'Insane');
            done();
        }).catch(done);
    });

    it('should play song in context and return correct status', function (done) {
        const spotilocal = new Spotilocal();
        const trackUri = 'spotify:track:3cANM3NuUjRDTi8fdU8P6q';
        spotilocal.init().then((spotilocal) => {
            return spotilocal.play(trackUri, 'spotify:user:shyyko.serhiy:playlist:4SdN0Re3tJg9uG08z2Gkr1')
        }).then((status) => {
            assert.strictEqual(status.playing, true);
            assert.strictEqual(status.track.track_resource.uri, trackUri);
            assert.strictEqual(status.track.track_resource.name, 'Brother');
            done();
        }).catch(done);
    });
});

describe('#play() and #pause()', function () {
    it('should play song pause it and resume it', function (done) {
        const spotilocal = new Spotilocal();
        const trackUri = 'spotify:track:3cANM3NuUjRDTi8fdU8P6q';
        spotilocal.init().then((spotilocal) => {
            return spotilocal.play(trackUri, 'spotify:user:shyyko.serhiy:playlist:4SdN0Re3tJg9uG08z2Gkr1')
        }).then((status) => {
            assert.strictEqual(status.playing, true);
            assert.strictEqual(status.track.track_resource.uri, trackUri);
            return spotilocal.pause(true);
        }).then((status)=>{
            assert.strictEqual(status.playing, false);
            assert.strictEqual(status.track.track_resource.uri, trackUri);
            return spotilocal.pause(false);            
        }).then((status)=>{
            assert.strictEqual(status.playing, true);
            assert.strictEqual(status.track.track_resource.uri, trackUri);
            done();         
        }).catch(done);
    });
});
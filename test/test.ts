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
        spotilocal.getStatus().then(()=>{
            done('Should have failed');
        }).catch((error)=>{
            assert.equal(error, SPOTILOCAL_IS_NOT_INITIALIZED);
            done();
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
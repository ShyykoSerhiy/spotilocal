import {Spotilocal} from '../src/index';

describe('#init()', function () {
    this.timeout(10000);
    it('should init spotilocal', function (done) {
        const spotilocal = new Spotilocal();
        spotilocal.init().then(() => { done(); }).catch(done);
    });
});

describe('#getStatus()', function () {
    this.timeout(10000);
    it('should get status from spotilocal', function (done) {
        const spotilocal = new Spotilocal();
        spotilocal.init().then((spotilocal) => {
            return spotilocal.getStatus()
        }).then((status) => {
            done();
        }).catch(done);
    });
});
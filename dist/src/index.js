"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var request = require('superagent');
var https = require('https');
function failIfNotInitialized(target, propertyKey, descriptor) {
    var fn = descriptor.value;
    if (typeof fn !== 'function') {
        throw new Error("@failIfNotInitialized can only be applied to method and not to " + typeof fn);
    }
    return Object.assign({}, descriptor, { value: function () {
            if (!this.initialized) {
                return Promise.reject(exports.SPOTILOCAL_IS_NOT_INITIALIZED);
            }
            return fn.apply(this, arguments);
        } });
}
exports.SPOTILOCAL_IS_NOT_INITIALIZED = 'Spotilocal is not initialized';
var Spotilocal = (function () {
    function Spotilocal() {
    }
    Spotilocal.prototype.init = function () {
        var _this = this;
        return Spotilocal.getSpotilocalUrl().then(function (spotilocalUrl) {
            _this.spotilocalUrl = spotilocalUrl;
            return Promise.all([Spotilocal.getOauthToken(), Spotilocal.getCsrfToken(_this.spotilocalUrl)]);
        }).then(function (value) {
            _this.oauth = value[0];
            _this.csrf = value[1];
            _this.initialized = true;
            return _this;
        });
    };
    Spotilocal.prototype.getStatus = function () {
        return this.genericCommand('status');
    };
    /**
     * Pauses(or unpauses) playback of spotify.
     * @param pause if true, then pauses playback. If else resumes playback.
     */
    Spotilocal.prototype.pause = function (pause) {
        if (pause === void 0) { pause = true; }
        var params = new Map();
        params.set('pause', pause);
        return this.genericCommand('pause', params);
    };
    /**
     * Plays song with uri in provided context.
     * @param uri track uri
     * @param context context of song(where it exists). Examples: playlist uri, album uri and so on.
     */
    Spotilocal.prototype.play = function (uri, context) {
        var params = new Map();
        params.set('uri', uri);
        context && params.set('context', context);
        return this.genericCommand('play', params);
    };
    Spotilocal.prototype.genericCommand = function (command, additionalProps) {
        var _this = this;
        var additionalQuery = (additionalProps && additionalProps.size) ? "&" + Array.from(additionalProps.entries()).reduce(function (prev, curr) {
            return prev + "&" + curr[0] + "=" + encodeURIComponent(curr[1]);
        }, '') : '';
        return new Promise(function (resolve, reject) {
            Spotilocal.requestToAbsolutelyUglyNotSecuredRequest(request.get(_this.spotilocalUrl + "remote/" + command + ".json?csrf=" + _this.csrf + "&oauth=" + _this.oauth + additionalQuery))
                .end(function (err, res) {
                if (err || !res.ok) {
                    reject(err || res.status);
                }
                else {
                    resolve(res.body);
                }
            });
        });
    };
    /**
     * Gets oauth token that will be used in all later calls to spotilocal
     */
    Spotilocal.getOauthToken = function () {
        return new Promise(function (resolve, reject) {
            request.get('https://open.spotify.com/token').end(function (err, res) {
                if (err || !res.ok) {
                    reject(err || res.status);
                }
                else {
                    var t = res.body.t;
                    resolve(t);
                }
            });
        });
    };
    /**
     * Gets csrf token that will be used in all later calls to spotilocal
     */
    Spotilocal.getCsrfToken = function (spotilocalUrl) {
        return new Promise(function (resolve, reject) {
            Spotilocal.requestToAbsolutelyUglyNotSecuredRequest(request.get(spotilocalUrl + "simplecsrf/token.json"))
                .end(function (err, res) {
                if (err || !res.ok) {
                    reject(err || res.status);
                }
                else {
                    var token = res.body.token;
                    resolve(token);
                }
            });
        });
    };
    /**
     * Gets spotilocal appi url with port in range 4370-4380.
     */
    Spotilocal.getSpotilocalUrl = function () {
        var subdomain = 'tommarvoloriddle'.split('').map(function (v, i, arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }).join('');
        return new Promise(function (resolve, reject) {
            var tryGetSpotilocalVersion = function (port) {
                if (port > 4380) {
                    reject('It looks like spotify isn\'t open. We failed to find spotiflocal url with ports in range 4370-4380.');
                }
                var possibleUrl = "https://" + subdomain + ".spotilocal.com:" + port + "/";
                Spotilocal.getSpotilocalVersion(possibleUrl).then(function () { resolve(possibleUrl); }).catch(function () {
                    tryGetSpotilocalVersion(port + 1);
                });
            };
            tryGetSpotilocalVersion(4370);
        });
    };
    /**
     * Gets spotilocal version (presumably version of spotify local server)
     */
    Spotilocal.getSpotilocalVersion = function (apiUrl) {
        return new Promise(function (resolve, reject) {
            Spotilocal.requestToAbsolutelyUglyNotSecuredRequest(request.get(apiUrl + "service/version.json?service=remote"))
                .end(function (err, res) {
                if (err || !res.ok) {
                    reject(err || res.status);
                }
                else {
                    resolve(JSON.parse(res.text));
                }
            });
        });
    };
    /**
     * Sets rejectUnauthorized to false, Origin to https://open.spotify.com and timeout to 1000
     */
    Spotilocal.requestToAbsolutelyUglyNotSecuredRequest = function (request) {
        return request.agent(new https.Agent({ rejectUnauthorized: false }))
            .set('Origin', 'https://open.spotify.com')
            .timeout(1000);
    };
    __decorate([
        failIfNotInitialized
    ], Spotilocal.prototype, "getStatus", null);
    __decorate([
        failIfNotInitialized
    ], Spotilocal.prototype, "pause", null);
    __decorate([
        failIfNotInitialized
    ], Spotilocal.prototype, "play", null);
    return Spotilocal;
}());
exports.Spotilocal = Spotilocal;

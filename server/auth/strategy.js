"use strict";

var util = require('util'),
    passport = require('passport-strategy');


/*

passport.authenticate('etg',function Verify(loginInfo,){

})
*/
function Strategy(options, verify) {
    if (typeof options == 'function') {
        verify = options;
        options = undefined;
    }
    options = options || {};
    passport.Strategy.call(this);
    this.name = 'etg';
    this._verify = verify;
    this._passReqToCallback = options.passReqToCallback;
    // to add oauth sopport
}

Strategy.loginType = {
    email: 0,
    IKey: 1
};



util.inherits(Strategy, passport.Strategy);

Strategy.prototype.authenticate = function(req, options) {
    options = options || {};
    var self = this;
    var value = lookup(req.body) || lookup(req.query);
    if (value === null) {
        self.fail("not found");
    }

    function verified(err, user, info) {
        if (err) {
            return self.error(err);
        }
        if (!user) {
            return self.fail(info);
        }
        self.success(user, info);
    }

    try {
        if (self._passReqToCallback) {
            self._verify(req, value, verified);
        } else {
            self._verify(value, verified);
        }
    } catch (ex) {
        return self.error(ex);
    }

    function lookup(obj) {
        if (!obj) {
            return null;
        }
        if (obj.loginType === Strategy.loginType.IKey && obj.serial) {
            return {
                "serial": obj.serial,
                "loginType": Strategy.loginType.IKey
            };
        } else if (obj.loginType === Strategy.loginType.email && obj.email && obj.password) {
            return {
                "email": obj.email,
                "password": obj.password,
                "loginType": Strategy.loginType.email
            };
        }
    }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;

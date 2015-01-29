function myQ() {
}

myQ.log = function(msg) {
  console.log("myQ: " + msg);
}

myQ.prototype.log = function(msg) {
  myQ.log(msg);
}

myQ.appId = 'Vj8pQggXLhLy0WHahglCD4N1nAkkXQtGYpq2HrHD7H1nvmbT55KqtN6RSF4ILB%2fi';
myQ.baseUrl = 'https://myqexternal.myqdevice.com/';

myQ.authenticateUrl = function(emailAddress, password) {
  this.log('.authenticateUrl');
  return this.baseUrl
    + 'Membership/ValidateUserWithCulture?appId='
    + this.appId
    + '&securityToken=null&username='
    + encodeURI(emailAddress)
    + '&password='
    + encodeURI(password)
    + '&culture=en';
};

myQ.prototype.isAuthenticated = function() {
  this.log('#isAuthenticated');
  return !!this.securityToken;
};

myQ.prototype.authenticate = function(emailAddress, password, opts) {
  // success_cb, failure_cb, error_cb) {
  opts = opts || {};
  this.log('myQ#authenticate');
  var authUrl = myQ.authenticateUrl(emailAddress, password);
  this.log('url: ' + authUrl);
  // success and failure callbacks below are wrapped in closures
  // so we can set securityToken on the instance of myQ.
  myQ.ajax(
    { url: authUrl, type: 'json' },
    (function(_this){
      return function(data) {
        _this.log('received log in response');
        _this.log(JSON.stringify(data));
        if (data.SecurityToken) {
          _this.log('Log in successful');
          _this.securityToken = data.SecurityToken;
          if (opts["success"]) { opts["success"](data); }
        } else {
          _this.log('Log in failure');
          _this.securityToken = undefined;
          if (opts["failure"]) { opts["failure"](data); }
        }
        if (opts["always"]) { opts["always"](); }
      };
    })(this),
    (function(_this){
      return function(msg) {
        _this.log(JSON.stringify(msg));
        _this.log('log in error');
        _this.securityToken = undefined;
        if (opts["error"]) { opts["error"](msg); }
        if (opts["always"]) { opts["always"](); }
      };
    })(this)
  );
  return true;
};

myQ.devicesUrl = function(token) {
  this.log('.authenticateUrl');
  return this.baseUrl
    + 'api/UserDeviceDetails?appId='
    + this.appId
    + '&securityToken='
    + token;
};

myQ.prototype.getDevices = function(success_cb, failure_cb, error_cb) {
  this.log('myQ#getDevices');
  var devicesUrl = myQ.devicesUrl(this.securityToken);
  this.log('url: ' + devicesUrl);
  // success and failure callbacks below are wrapped in closures
  // so we can set use methods on myQ instance.
  myQ.ajax(
    { url: devicesUrl, type: 'json' },
    (function(_this){
      return function(data) {
        _this.log('received devices response');
        _this.log(JSON.stringify(data));
        if (data.ReturnCode == "0") {
          _this.log('got device list');
          success_cb(data);
        } else {
          _this.log('no device list');
          failure_cb(data);
        }
      };
    })(this),
    (function(_this){
      return function(msg) {
        _this.log(JSON.stringify(msg));
        _this.log('devices error');
        error_cb(msg);
      };
    })(this)
  );
  return true;
};

module.exports = myQ;
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

myQ.prototype.authenticate = function(emailAddress, password, callbacks) {
  callbacks = callbacks || {};
  this.log('myQ#authenticate');
  var authUrl = myQ.authenticateUrl(emailAddress, password);
  this.log('url: ' + authUrl);
  // success and failure callbacks below are wrapped in closures
  // so we can set securityToken on the instance of myQ.
  myQ.ajax(
    { url: authUrl, type: 'json' },
    (function(_this, callbacks){
      return function(data) {
        _this.log('received log in response');
        _this.log(JSON.stringify(data));
        if (data.SecurityToken) {
          _this.log('Log in successful');
          _this.securityToken = data.SecurityToken;
          if (callbacks["success"]) { callbacks["success"](data); }
        } else {
          _this.log('Log in failure');
          _this.securityToken = undefined;
          if (callbacks["failure"]) { callbacks["failure"](data); }
        }
        if (callbacks["always"]) { callbacks["always"](); }
      };
    })(this, callbacks),
    (function(_this, callbacks){
      return function(msg) {
        _this.log(JSON.stringify(msg));
        _this.log('log in error');
        _this.securityToken = undefined;
        if (callbacks["error"]) { callbacks["error"](msg); }
        if (callbacks["always"]) { callbacks["always"](); }
      };
    })(this, callbacks)
  );
  return true;
};

myQ.devicesUrl = function(token) {
  this.log('.devicesUrl');
  return this.baseUrl
    + 'api/UserDeviceDetails?appId='
    + this.appId
    + '&securityToken='
    + token;
};

myQ.prototype.getDevices = function(callbacks) {
  this.log('#getDevices');
  callbacks = callbacks || {};
  if (this.devicesData) {
    this.log('using cached devices list');
    if (callbacks["success"]) { callbacks["success"](this.devicesData); }
    if (callbacks["always"]) { callbacks["always"](); }
  } else {
    var devicesUrl = myQ.devicesUrl(this.securityToken);
    this.log('url: ' + devicesUrl);
    // success and failure callbacks below are wrapped in closures
    // so we can set use methods on myQ instance.
    myQ.ajax(
      { url: devicesUrl, type: 'json' },
      (function(_this, callbacks){
        return function(data) {
          _this.log('received devices response');
          // _this.log(JSON.stringify(data));
          if (data.ReturnCode == "0") {
            _this.log('got device list');
            _this.devicesData = data;
            if (callbacks["success"]) { callbacks["success"](data); }
          } else {
            _this.log('no device list');
            if (callbacks["failure"]) { callbacks["failure"](data); }
          }
          if (callbacks["always"]) { callbacks["always"](); }
        };
      })(this, callbacks),
      (function(_this, callbacks){
        return function(msg) {
          _this.log(JSON.stringify(msg));
          _this.log('devices error');
          if (callbacks["error"]) { callbacks["error"](msg); }
          if (callbacks["always"]) { callbacks["always"](); }
        };
      })(this, callbacks)
    );
  }
  return true;
};

module.exports = myQ;
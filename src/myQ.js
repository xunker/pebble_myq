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

myQ.prototype.authenticate = function(emailAddress, password, success_cb, failure_cb, error_cb) {
  console.log('myQ#authenticate');
  var authUrl = myQ.authenticateUrl(emailAddress, password);
  console.log('url: ' + authUrl);
  // success and failure callbacks below are wrapped in closures
  // so we can set securityToken on the instance of myQ.
  myQ.ajax(
    { url: authUrl, type: 'json' },
    (function(_this){
      return function(data) {
        console.log('received log in response');
        console.log(JSON.stringify(data));
        if (data.SecurityToken) {
          console.log('Log in successful');
          _this.securityToken = data.SecurityToken;
          success_cb(data);
        } else {
          console.log('Log in failure');
          _this.securityToken = undefined;
          failure_cb(data);
        }
      };
    })(this),
    (function(_this){
      return function(msg) {
        console.log(JSON.stringify(msg));
        console.log('log in error');
        this.securityToken = undefined;
        error_cb(msg);
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
  console.log('myQ#getDevices');
  var devicesUrl = myQ.devicesUrl(this.securityToken);
  console.log('url: ' + devicesUrl);
  myQ.ajax(
    { url: devicesUrl, type: 'json' },
    function(data) {
      console.log('received devices response');
      console.log(JSON.stringify(data));
      if (data.ReturnCode == "0") {
        console.log('got device list');
        success_cb(data);
      } else {
        console.log('no device list');
        failure_cb(data);
      }
    },
    function(msg) {
      console.log(JSON.stringify(msg));
      console.log('devices error');
      error_cb(msg);
    }
  );
  return true;
};

module.exports = myQ;
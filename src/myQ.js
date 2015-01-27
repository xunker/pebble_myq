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
  myQ.ajax(
    { url: authUrl, type: 'json' },
    function(data) {
      console.log('received log in response');
      console.log(JSON.stringify(data));
      if (data.SecurityToken) {
        console.log('Log in successful');
        this.securityToken = data.SecurityToken;
        success_cb(data);
      } else {
        console.log('Log in failure');
        this.securityToken = undefined;
        failure_cb(data);
      }
    },
    function(msg) {
      console.log(JSON.stringify(msg));
      console.log('log in error');
      this.securityToken = undefined;
      error_cb(msg);
    }
  );
  return true;
};

module.exports = myQ;
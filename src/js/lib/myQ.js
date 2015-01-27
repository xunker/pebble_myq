function myQ() {
  var appId = 'Vj8pQggXLhLy0WHahglCD4N1nAkkXQtGYpq2HrHD7H1nvmbT55KqtN6RSF4ILB%2fi';
  var baseUrl = 'https://myqexternal.myqdevice.com/';
  this.securityToken = undefined;
}

myQ.prototype.isAuthenticated = function() {
  return !!this.securityToken;
};

myQ.prototype.authenticateUrl = function() {
  return this.baseUrl
    + 'Membership/ValidateUserWithCulture?appId='
    + this.appId
    + '&securityToken=null&username='
    + encodeURI(this.emailAddress)
    + '&password='
    + encodeURI(this.password)
    + '&culture=en';
};

myQ.prototype.authenticate = function(emailAddress, password, success, failure, error) {
  
  ajax(
    { url: this.authenticateUrl(), type: 'json' },
    function(data) {
      console.log('received log in response');
      if (data.SecurityToken) {
        console.log('Log in successful');
        this.securityToken = data.SecurityToken;
        success();
      } else {
        console.log('Log in failure');
        this.securityToken = undefined;
        failure();
      }
    },
    function(error) {
      console.log('log in error');
      this.securityToken = undefined;
      error();
    }
  );
};

module.exports = myQ;
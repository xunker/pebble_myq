describe("myQ", function() {
  var myQ = require('../../src/myQ.js');
  myQ.log = function() {}; // silence logging
  var subject;

  beforeEach(function() {
    subject = new myQ();
  });

  describe("#isAuthenticated()", function(){
    describe('#securityToken is defined', function() {
      beforeEach(function() {
        subject.securityToken = 'xxx';
      });
      it('is true', function() {
        expect(subject.isAuthenticated()).toEqual(true);
      });
    });

    describe('.securityToken is undefined', function() {
      it('is false', function() {
        expect(subject.isAuthenticated()).toEqual(false);
      });
    });
  });

  describe(".authenticateUrl()", function(){
    var emailAddress = 'xxx@yyy.com';
    var password = 'p@ssw0rd';

    it('return a constructed url', function() {
      expect(myQ.authenticateUrl(emailAddress, password)).toEqual(
        'https://myqexternal.myqdevice.com/'
          + 'Membership/ValidateUserWithCulture?appId='
          + 'Vj8pQggXLhLy0WHahglCD4N1nAkkXQtGYpq2HrHD7H1nvmbT55KqtN6RSF4ILB%2fi'
          + '&securityToken=null&username='
          + encodeURI(emailAddress)
          + '&password='
          + encodeURI(password)
          + '&culture=en'
      );
    });
  });
});

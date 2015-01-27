describe("myQ", function() {
  var myQ = require('../../src/myQ.js');
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

  describe("#authenticateUrl()", function(){
    var emailAddress = 'xxx@yyy.com';
    var password = 'p@ssw0rd';

    beforeEach(function() {
      subject.emailAddress = emailAddress;
      subject.password = password;
    });

    it('return a constructed url', function() {
      expect(subject.authenticateUrl()).toEqual(
        myQ.baseUrl + 'Membership/ValidateUserWithCulture?appId='
          + myQ.appId
          + '&securityToken=null&username='
          + encodeURI(emailAddress)
          + '&password='
          + encodeURI(password)
          + '&culture=en'
      );
    });
  });
});

describe("myQ", function() {
  var myQ = require('../../src/myQ.js');
  myQ.log = function() {}; // silence logging

  var appId = 'Vj8pQggXLhLy0WHahglCD4N1nAkkXQtGYpq2HrHD7H1nvmbT55KqtN6RSF4ILB%2fi';

  var subject;

  beforeEach(function() {
    subject = new myQ();
  });

  describe("#isAuthenticated", function(){
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

  describe("#authenticate", function(){
    beforeEach(function() {
      myQ.ajax = {};
    });

    var emailAddress = 'x@y.z';
    var password = 'password';
    var successCB = function() {};
    var failureCB = function() {};

    it('calls .ajax with options and callbacks', function() {
      spyOn(myQ, 'ajax');
      subject.authenticate(emailAddress, password, successCB, failureCB);
      expect(myQ.ajax).toHaveBeenCalledWith(
        { url: myQ.authenticateUrl(emailAddress, password), type: 'json' },
        jasmine.any(Function), jasmine.any(Function)
      );
    });

    describe("valid credentials", function() {
      var securityToken = 'xxx';

      beforeEach(function() {
        myQ.ajax = function(_,success_cb,_) {
          success_cb({ "SecurityToken":securityToken});
        };
      });

      it('sets #securityToken on the instance', function() {
        subject.authenticate(null, null, function(){}, null);
        expect(subject.securityToken).toEqual("xxx");
      });
      it('executes the success callback', function() {
        var observer = {callback: function(){}};
        spyOn(observer, 'callback');
        subject.authenticate(null, null, function() { observer.callback() }, null);
        expect(observer.callback).toHaveBeenCalled();
      });
    });
    describe("invalid credentials", function() {
      beforeEach(function() {
        subject.securityToken = 'xxx';
        myQ.ajax = function(_,success_cb,_) { success_cb({}); };
      });

      it('clears #securityToken on the instance', function() {
        subject.authenticate(null, null, null, function(){});
        expect(subject.securityToken).toEqual(undefined);
      });
      it('executes the failure callback', function() {
        var observer = {callback: function(){}};
        spyOn(observer, 'callback');
        subject.authenticate(null, null, null, function() { observer.callback() });
        expect(observer.callback).toHaveBeenCalled();
      });
    });
    describe("request error", function() {
      beforeEach(function() {
        subject.securityToken = 'xxx';
        myQ.ajax = function(_,_,failure_cb) { failure_cb({}); };
      });

      it('clears #securityToken on the instance', function() {
        subject.authenticate(null, null, null, null, function(){});
        expect(subject.securityToken).toEqual(undefined);
      });
      it('executes the error callback', function() {
        var observer = {callback: function(){}};
        spyOn(observer, 'callback');
        subject.authenticate(null, null, null, null, function() { observer.callback() });
        expect(observer.callback).toHaveBeenCalled();
      });
    });
  });

  describe(".authenticateUrl", function(){
    var emailAddress = 'xxx@yyy.com';
    var password = 'p@ssw0rd';

    it('return a constructed url', function() {
      expect(myQ.authenticateUrl(emailAddress, password)).toEqual(
        'https://myqexternal.myqdevice.com/'
          + 'Membership/ValidateUserWithCulture?appId='
          + appId
          + '&securityToken=null&username='
          + encodeURI(emailAddress)
          + '&password='
          + encodeURI(password)
          + '&culture=en'
      );
    });
  });

  describe(".devicesUrl", function(){
    var token = 'xxx';

    it('return a constructed url', function() {
      expect(myQ.devicesUrl(token)).toEqual(
        'https://myqexternal.myqdevice.com/'
          + 'api/UserDeviceDetails?appId='
          + appId
          + '&securityToken='
          + token
      );
    });
  });
});

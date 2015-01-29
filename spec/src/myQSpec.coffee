describe "myQ", ->
  myQ = require("../../src/myQ.js")
  myQ.log = -> # silence logging

  appId = "Vj8pQggXLhLy0WHahglCD4N1nAkkXQtGYpq2HrHD7H1nvmbT55KqtN6RSF4ILB%2fi"
  subject = undefined
  beforeEach ->
    subject = new myQ()
    
  describe "#isAuthenticated", ->
    describe "#securityToken is defined", ->
      beforeEach ->
        subject.securityToken = "xxx"

      it "is true", ->
        expect(subject.isAuthenticated()).toEqual true
        
    describe ".securityToken is undefined", ->
      it "is false", ->
        expect(subject.isAuthenticated()).toEqual false
        
  describe "#authenticate", ->
    beforeEach ->
      myQ.ajax = {}

    emailAddress = "x@y.z"
    password = "password"
    successCB = ->

    failureCB = ->

    it "calls .ajax with options and callbacks", ->
      spyOn myQ, "ajax"
      subject.authenticate emailAddress, password,
        success: successCB
        failure: failureCB

      expect(myQ.ajax).toHaveBeenCalledWith
        url: myQ.authenticateUrl(emailAddress, password)
        type: "json"
      , jasmine.any(Function), jasmine.any(Function)

    describe "valid credentials", ->
      securityToken = "xxx"
      beforeEach ->
        myQ.ajax = (_, success_cb, __) ->
          success_cb SecurityToken: securityToken
          
      it "sets #securityToken on the instance", ->
        subject.authenticate null, null,
          success: ->

        expect(subject.securityToken).toEqual "xxx"

      it "executes the success callback", ->
        observer = callback: ->

        spyOn observer, "callback"
        subject.authenticate null, null,
          success: ->
            observer.callback()

        expect(observer.callback).toHaveBeenCalled()

      it "executes the always callback"

    describe "invalid credentials", ->
      beforeEach ->
        subject.securityToken = "xxx"
        myQ.ajax = (_, success_cb, __) ->
          success_cb {}

      it "clears #securityToken on the instance", ->
        subject.authenticate null, null,
          failure: ->

        expect(subject.securityToken).toEqual `undefined`

      it "executes the failure callback", ->
        observer = callback: ->

        spyOn observer, "callback"
        subject.authenticate null, null,
          failure: ->
            observer.callback()

        expect(observer.callback).toHaveBeenCalled()

      it "executes the always callback"

    describe "request error", ->
      beforeEach ->
        subject.securityToken = "xxx"
        myQ.ajax = (_, __, failure_cb) ->
          failure_cb {}

      it "clears #securityToken on the instance", ->
        subject.authenticate null, null,
          error: ->

        expect(subject.securityToken).toEqual `undefined`

      it "executes the error callback", ->
        observer = callback: ->

        spyOn observer, "callback"
        subject.authenticate null, null,
          error: ->
            observer.callback()

        expect(observer.callback).toHaveBeenCalled()

      it "executes the always callback"

  describe ".authenticateUrl", ->
    emailAddress = "xxx@yyy.com"
    password = "p@ssw0rd"
    it "return a constructed url", ->
      expect(myQ.authenticateUrl(emailAddress, password)).toEqual "https://myqexternal.myqdevice.com/" + "Membership/ValidateUserWithCulture?appId=" + appId + "&securityToken=null&username=" + encodeURI(emailAddress) + "&password=" + encodeURI(password) + "&culture=en"
      
  describe ".devicesUrl", ->
    token = "xxx"
    it "return a constructed url", ->
      expect(myQ.devicesUrl(token)).toEqual "https://myqexternal.myqdevice.com/" + "api/UserDeviceDetails?appId=" + appId + "&securityToken=" + token
      
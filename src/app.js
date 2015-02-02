/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
// var Vector2 = require('vector2');
var Settings = require('settings');
var myQLib = require('myQ');
myQLib.ajax = require('ajax'); // here to make testing easier
var myQ = new myQLib();

var Interface = require('interface');
Interface(Settings, UI, new myQLib());

/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var Settings = require('settings');
var myQLib = require('myQ');
myQLib.ajax = require('ajax'); // here to make testing easier
var myQ = new myQLib();

var emailAddress = '';
var password = '';

var loadSettings = function() {
  console.log('Loading settings');
  console.log(JSON.stringify(Settings.option()));
  emailAddress = Settings.option().emailAddress;
  console.log('EmailAddress: ' + emailAddress);
  password = Settings.option().password;
  console.log('password: ' + password);
};

var resetSettings = function() {
  console.log('Resetting settings.');
  Settings.option('emailAddress', null);
  Settings.option('password', null);
  console.log('Done resetting.');
};

var haveStoredCredentials = function() {
  return !!(emailAddress && password);
};

Settings.config(
  { url: 'https://s3.amazonaws.com/pebblemyq/settings.html' },
  function(e) {
    console.log('opening configurable');
    console.log(JSON.stringify(Settings.option()));
  },
  function(e) {
    console.log('closed configurable');
    console.log(JSON.stringify(e.options)); 

    if (e.options.emailAddress) {
      console.log('Storing email address: ' + e.options.emailAddress);
      Settings.option('emailAddress', e.options.emailAddress);
    }
    if (e.options.emailAddress) {
      console.log('Storing password: ' + e.options.password);
      Settings.option('password', e.options.password);
    }
    console.log('Done');
    main();
  }
);

var pleaseConfigureCard = new UI.Card({
  body: 'You myQ email address and password are not set yet. Please configure the app on your phone first.'
});

var mainCard = new UI.Card({
  title: 'Pebble MyQ',
  icon: 'images/garage-door.png',
  subtitle: 'Hello World!',
  body: 'Press any button.'
});

var authenticateUser = function() {
  var authenticatingCard = new UI.Card({
    subtitle: 'Logging in...'
  });

  authenticatingCard.show();

  console.log('calling authenticate');
  myQ.authenticate(emailAddress, password, {
    "success": function(data) {
      console.log('success callback');
    },
    "failure": function(data) {
      console.log('failure callback');

      var msg = 'Unknown problem.';
      if (data.ErrorMessage) {
        msg = data.ErrorMessage;
      }

      var failureCard = new UI.Card({
        subtitle: 'Problem logging in',
        body: msg
      });
      
      failureCard.show();
    }, "error": function(error) {
      console.log('error callback');

      var msg = 'Unknown problem.';
      if (data.ErrorMessage) {
        msg = data.ErrorMessage;
      }
      var errorCard = new UI.Card({
        subtitle: 'Problem logging in',
        body: msg
      });

      errorCard.show();
    }, "always": function() {
      console.log("always callback");
      authenticatingCard.hide();
    }
  });

};

var main = function() {
  loadSettings();
  if (haveStoredCredentials()) {
    mainCard.show();
    pleaseConfigureCard.hide();
    authenticateUser();
  } else {
    pleaseConfigureCard.show();
    mainCard.hide();
  }
};

main();

mainCard.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});

mainCard.on('longClick', 'up', function(e) {
  resetSettings();
  main();
});

var showLoadingCard = function() {
  var loadingCard = new UI.Card({
    subtitle: 'Loading...'
  });
  loadingCard.show();
  return loadingCard;
};

mainCard.on('click', 'select', function(e) {
  var loadingCard = showLoadingCard();

  var card = new UI.Card();
  console.log('calling getDevices');
  myQ.getDevices(function(data) {
    console.log('devices success callback');
    loadingCard.hide();
    card.title('Number of Devices');
    card.body(data.Devices.length);
    card.show();
  }, function(data) {
    console.log('devices failure callback');
    loadingCard.hide();
    card.title('Problem getting devices');
    card.show();
  }, function(error) {
      console.log('devices error callback');
      loadingCard.hide();
      card.title('Error!');
      card.subtitle('Error getting devices');
      card.body('No idea why.');
      card.show();
    }
  );
});

// mainCard.on('click', 'select', function(e) {
//   var wind = new UI.Window();
//   var textfield = new UI.Text({
//     position: new Vector2(0, 50),
//     size: new Vector2(144, 30),
//     font: 'gothic-24-bold',
//     text: 'Text Anywhere!',
//     textAlign: 'center'
//   });
//   wind.add(textfield);
//   wind.show();
// });

mainCard.on('click', 'down', function(e) {
  authenticateUser();
});

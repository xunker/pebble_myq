/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var Settings = require('settings');
var myQ = new require('myQ')();

var emailAddress = '';
var password = '';

var loadSettings = function() {
  console.log('Loading settings');
  emailAddress = Settings.option().emailAddress;
  password = Settings.option().password;
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
    loadSettings();
  }
);

var main = new UI.Card({
  title: 'Pebble.js',
  icon: 'images/garage-door.png',
  subtitle: 'Hello World!',
  body: 'Press any button.'
});

loadSettings();
main.show();

main.on('click', 'up', function(e) {
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

main.on('click', 'select', function(e) {
  var wind = new UI.Window();
  var textfield = new UI.Text({
    position: new Vector2(0, 50),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();

  ajax(
    { url: baseUrl + '/Membership/ValidateUserWithCulture?appId=' + appId + '&securityToken=null&username=' + encodeURI(emailAddress) + '&password=' + encodeURI(password) + '&culture=en', type: 'json' },
    function(data) {
      console.log('log in successful');
      card.title('Logged In');
      card.subtitle(data.UserId);
      card.body(data.SecurityToken);
      card.show();
    },
    function(error) {
      console.log('log in error');
      card.title('Error!');
      card.subtitle('Error logging in');
      card.body(error);
      card.show();
    }
  );
  


});

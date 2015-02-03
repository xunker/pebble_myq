var UI = {
  Card: function(opts) {
    opts = opts || {};
    opts.name = opts.name || 'unnamed card';
    cardEl = $(".storage .card-container").clone();
    if (opts.name) { cardEl.find('.card-name').text(opts.name); }
    if (opts.icon) {
      icon = $("<img class='icon' src='/resources/" + opts.icon + "'/>");
      cardEl.find('.content').append(icon);
    }
    if (opts.title) {
      title = $("<div class='title'/>");
      title.text(opts.title);
      cardEl.find('.content').append(title);
    }
    if (opts.subtitle) {
      subtitle = $("<div class='subtitle'/>");
      subtitle.text(opts.subtitle);
      cardEl.find('.content').append(subtitle);
    }
    if (opts.body) {
      body = $("<div class='body'/>");
      body.text(opts.body);
      cardEl.find('.content').append(body);
    }

    cardEl.title = function(value) {
      title = $("<div class='title'/>");
      title.text(value);
      cardEl.find('.content').append(title);
    }
    cardEl.body = function(value) {
      body = $("<div class='body'/>");
      body.text(value);
      cardEl.find('.content').append(body);
    }
    cardEl.show = function() {
      console.log("Showing: ");
      console.log(this);
      activeCard(this);
    };
    cardEl.hide = function() {
      // this.addClass('hidden');
      console.log("Hiding: ");
      console.log(this);
      this.remove();
      activeCard();
    };
    cardEl.on = function(eventName, buttonName, eventHandler) {
      if (eventHandler) {
        var btnSelector = '.buttons .' + buttonName + ' .' + eventName;
        $(this[0]).find(btnSelector).removeClass('hidden');
        $(this[0]).on(buttonName + eventName, eventHandler);
      } else {
        $(this[0]).on(eventName, buttonName);
      }
    };
    $('.watch').prepend(cardEl);
    return cardEl;
  },
  Menu: function(opts) {
    cardEl = UI.Card(opts);
    $.each((opts.sections || []), function(sectionIndex, section) {
      var sectionEl = $('<div class="section"></div>');
      $.each((section.items || []), function(itemIndex, item) {
        console.log('item');
        console.log(item);
        var itemEl = $('<div class="item"></div>');
        if (item.icon) {
          icon = $("<img class='icon' src='/resources/" + item.icon + "'/>");
          itemEl.append(icon);
        }
        if (item.title) {
          title = $("<div class='title'/>");
          title.text(item.title);
          itemEl.append(title);
        }
        if (item.subtitle) {
          subtitle = $("<div class='subtitle'/>");
          subtitle.text(item.subtitle);
          itemEl.append(subtitle);
        }
        sectionEl.append(itemEl);
      });
      cardEl.find('.content').append(sectionEl);
    });
    $('.watch').prepend(cardEl);
    return cardEl;
  }
};

module.exports = UI;
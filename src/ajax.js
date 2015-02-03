var Ajax = function(opts, success, failure) {
  opts.success = success;
  opts.failure = failure;
  opts.method = opts.method || 'GET';
  $.ajax(opts);
};

module.exports = Ajax;
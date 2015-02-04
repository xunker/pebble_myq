var Ajax = function(opts, success, failure) {
  // opts.success = success;
  // opts.failure = failure;
  opts.method = opts.method || 'GET';
  $.ajax(opts).done(success).fail(function(error){
    if (error.state() == "rejected") {
      console.log("TODO ping-pong request through server to get around missing Access-Control-Allow-Origin");
    }
    failure(error);
  });
};

module.exports = Ajax;
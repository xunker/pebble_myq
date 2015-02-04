VERSION = "0.0.1"

require 'rubygems'
require 'sinatra'
require 'stitch-rb'

get '/' do
  content_type 'text/html'
  jsdata = File.open('./test.html').read
  jsdata
end

get '/app.js' do
  content_type 'application/javascript'
  Stitch::Package.new(files: ["app.js"], root: './').compile
end

get %r{/resources/([a-zA-Z0-9\-_\/\.]+)} do
  send_file("../resources/#{params[:captures].join}")
end
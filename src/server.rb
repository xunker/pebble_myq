VERSION = "0.0.1"

require 'rubygems'
require 'sinatra'
require 'stitch-rb'

APP_JS = ARGV[0] || "app.js"

get '/' do
  erb File.open('./test.html.erb').read
  # content_type 'text/html'
  # jsdata = File.open('./test.html').read
  # jsdata
end

get '/app.js' do
  content_type 'application/javascript'
  Stitch::Package.new(files: [APP_JS], root: './').compile
end

get %r{/resources/([a-zA-Z0-9\-_\/\.]+)} do
  send_file("../resources/#{params[:captures].join}")
end

helpers do
  def app_require_name
    APP_JS.split('.').first
  end
end
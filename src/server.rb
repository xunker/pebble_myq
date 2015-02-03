require 'rubygems'
require 'sinatra'
require 'stitch-rb'

before do
  cache_control :public, :must_revalidate, :max_age => 5
end

# get '/' do
#   content_type 'text/html'
#   File.open('./test.html').read
# end

get '/' do
  content_type 'text/html'
  jsdata = File.open('./test.html').read
  # while (mm = jsdata.match(/require\('([a-zA-Z0-9\-_\.]+)'\);?/)) do
  #   puts mm.inspect
  #   fn = mm[1]
  #   fn += '.js' unless fn =~ /\.js$/
  #   jsdata.sub!(mm[0], Stitch::Package.new(files: [fn], root: './').compile)
  # end
  jsdata
end

# get '/' do
#   content_type 'text/html'
#   File.open('./test.html').read.gsub(/__APP_JS__/,  Stitch::Package.new(files: ["app.js"], root: '.').compile);
# end

get '/app.js' do
  content_type 'application/javascript'
  # File.open('./app.js').read
  Stitch::Package.new(files: ["app.js"], root: './').compile
  # jsdata = File.open('./app.js').read
  # while (mm = jsdata.match(/require\('([a-zA-Z0-9\-_]+)'\);?/)) do
  #   puts mm.inspect
  #   jsdata.sub!(mm[0], Stitch::Package.new(files: ["#{mm[1]}.js"], root: './').compile)
  # end
  # jsdata
end

get %r{/resources/([a-zA-Z0-9\-_\/\.]+)} do
  send_file("../resources/#{params[:captures].join}")
end
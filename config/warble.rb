Warbler::Config.new do |config|
  app_name = File.read(File.join(File.dirname(__FILE__),"application.name")).strip
  config.jar_name = app_name
  config.webxml.jruby.min.runtimes = 10
  config.webxml.jruby.max.runtimes = 10
  config.includes = FileList["init.rb"]
end

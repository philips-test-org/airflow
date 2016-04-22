#!/usr/bin/env ruby

if ARGV.length != 1
  puts "\nUsage:  ruby rename.rb 'New Name'\n\n"

  exit
end

match = File.read("config/application.rb").match(/module (\w*)/)
current_name = match[1] if match

if current_name.nil?
  puts "\nCould not detect the current name of the application."
end

current_name = current_name.scan(/[A-Z][a-z]+/)
new_name = ARGV[0].scan(/[A-Z][a-z]+/)
new_name = [ARGV[0]] if new_name.length == 0

changes = [
  {
    file_names: ['app/controllers/application_controller.rb'],
    manipulation: lambda { |arr| arr.map(&:downcase).join("-") },
  },
  {

    file_names: ['db_scripts/create-glassfish-jdbc.sh', 'db_scripts/create.sql', 'db_scripts/install.sh', 'db_scripts/schema.sql', 'config/initializers/session_store.rb', 'config/database.yml', 'config/application.name'],
    manipulation: lambda {|arr| arr.map(&:downcase).join("") }
  },
  {
    file_names: ['config/application.rb'],
    manipulation: lambda {|arr| arr.map(&:capitalize).join("") }
  },
  {
    file_names: ['app/views/layouts/application.html.erb'],
    manipulation: lambda {|arr| arr.map(&:capitalize).join(" ") }
  },
]

changes.each do |name_change|
  name_change[:file_names].each do |file_name|
    text = File.read(file_name)

    if text.match(/#{name_change[:manipulation].call(current_name)}/)
      puts "Changing the name in #{file_name}"

      File.write(file_name, text.gsub(/#{name_change[:manipulation].call(current_name)}/, name_change[:manipulation].call(new_name)))
    else
      puts "Unable to find the app name in #{file_name}"
    end
  end
end

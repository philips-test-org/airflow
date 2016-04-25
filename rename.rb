#!/usr/bin/env ruby

if ARGV.length != 1
  puts "\nUsage:  ruby rename.rb 'New Name'\n\n"

  exit
end

unless ARGV[0].match(/^[a-zA-Z\d\s]*$/)
  puts "\nThe rename script only works with alphanumeric names. \n\n Example:  ruby rename.rb 'New Name'\n\n"

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
    file_names: ['app/controllers/application_controller.rb', 'config/application.name'],
    manipulation: lambda { |arr| arr.map(&:downcase).join("-") },
  },
  {

    file_names: ['db_scripts/create-glassfish-jdbc.sh', 'db_scripts/create.sql', 'db_scripts/install.sh', 'db_scripts/schema.sql', 'config/initializers/session_store.rb', 'config/database.yml'],
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
    formatted_old_name = name_change[:manipulation].call(current_name)
    formatted_new_name = name_change[:manipulation].call(new_name)

    if text.match(/#{formatted_old_name}/)
      puts "Changing #{formatted_old_name} to #{formatted_new_name} in #{file_name}"

      File.write(file_name, text.gsub(/#{formatted_old_name}/, formatted_new_name))
    else
      puts "Unable to find #{formatted_old_name} in #{file_name}"
    end
  end
end

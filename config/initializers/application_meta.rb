# Use application.name file to set a machine name and regular name
# global variables to use throughout the app
APPLICATION_MACHINE_NAME = File.read(File.join(Rails.root.join, 'config', 'application.name')).strip
APPLICATION_NAME = APPLICATION_MACHINE_NAME.split('-').map(&:capitalize).join(' ')

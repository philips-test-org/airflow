#!/bin/bash

APPNAME=`cat config/application.name`

# Standard file changes
echo "Warblizer: Creating version page"
git describe --always > app/views/main/_version.html.erb

# Warbalizing with changed files

echo "Warblizer: Bundling"
RAILS_ENV=production jruby -J-XX:MaxPermSize=256m -S bundle install --path=target

echo "Warblizer: Pre Cleaning Assets"
ASSETS="clean" RAILS_ENV=production jruby -S bundle exec rake assets:clean

echo "Warblizer: Precompiling Assets (this takes a while)"
ASSETS="precompile" RAILS_RELATIVE_URL_ROOT="/$APPNAME" RAILS_ENV=production jruby -J-XX:MaxPermSize=256m -S bundle exec rake assets:precompile

echo "Warblizer: Getting React/JS dependencies"
yarn install

echo "Warblizer: Building javascript bundle"
yarn build

echo "Warblizer: Building War File"
WARRING="warbilizing" RAILS_ENV=production jruby -S bundle exec warble war

echo "Warblizer: Post Cleaning Assets"
ASSETS="clean" RAILS_ENV=production jruby -S bundle exec rake assets:clean

echo "Warblizer: Changing permissions and war file name"
chmod +r "$APPNAME.war"
mv -v "$APPNAME.war" "$APPNAME.war.`git describe --always`"

# Resetting standard files
git checkout app/views/main/_version.html.erb

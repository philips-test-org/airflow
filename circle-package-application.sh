#!/bin/bash
set -e

CWD=`pwd`
APPNAME=`cat config/application.name`
VERSION=`git describe --always`
WARFILE="$APPNAME.war"
PACKAGEDIR="$APPNAME-$VERSION"
GIT_COMMIT_HASH=`git log -1 --pretty=format:"%h"`

echo "Warblizer: Creating version page"
git describe --always > app/views/main/_version.html.erb

# Warbalizing with changed files

echo "Warblizer: Bundling"
RAILS_ENV=production jruby -S bundle install --path=target

echo "Warblizer: Pre Cleaning Assets"
ASSETS="clean" RAILS_ENV=production jruby -S bundle exec rake assets:clean

echo "Warblizer: Precompiling Assets (this takes a while)"
JRUBY_OPTS="-J-Xmx1024m" ASSETS="precompile" RAILS_RELATIVE_URL_ROOT="/$APPNAME" RAILS_ENV=production jruby -S bundle exec rake assets:precompile

echo "Warblizer: Getting React/JS dependencies"
yarn install

echo "Warblizer: Building javascript bundle"
yarn build


echo "Warblizer: Building War File"
WARRING="warbilizing" RAILS_ENV=production jruby -S bundle exec warble compiled war

echo "Warblizer: Post Cleaning Assets"
ASSETS="clean" RAILS_ENV=production jruby -S bundle exec rake assets:clean

echo "Warblizer: Changing permissions and war file name"
chmod +r "$APPNAME.war"

mkdir -v $PACKAGEDIR
cp -Rv db_scripts $PACKAGEDIR
cp -v CHANGELOG.md $PACKAGEDIR
cp -v INSTALL.md $PACKAGEDIR
cp -v $WARFILE $PACKAGEDIR
zip -rq "$PACKAGEDIR-$GIT_COMMIT_HASH.zip" $PACKAGEDIR
rm -rf $PACKAGEDIR
echo "Packager: Created $PACKAGEDIR-$GIT_COMMIT_HASH.zip"

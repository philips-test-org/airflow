#!/bin/bash
set -e

CWD=`pwd`
APPNAME=`cat config/application.name`
VERSION=`git describe --always`
WARFILE="$APPNAME.war.$VERSION"
PACKAGEDIR="$APPNAME-$VERSION"
GIT_COMMIT_HASH=`git log -1 --pretty=format:"%h"`

echo "Warblizer: Creating version page"
git describe --always > app/views/main/_version.html.erb

echo "Warblizer: Bundling"
WARRING="warbilizing" RAILS_ENV=production jruby -S bundle install --path=target

echo "Warblizer: Pre Cleaning Assets"
WARRING="warbilizing" ASSETS="clean" RAILS_ENV=production jruby -J-XX:MaxPermSize=256m -J-Xmx4096m -S bundle exec rake assets:clean

echo "Warblizer: Precompiling Assets (this takes a while)"
ASSETS="precompile" RAILS_RELATIVE_URL_ROOT="/$APPNAME" RAILS_ENV=production jruby -J-XX:MaxPermSize=256m -J-Xmx4096m -S bundle exec rake assets:precompile

echo "Warblizer: Getting React/JS dependencies"
yarn global add webpack
yarn install --production

echo "Warblizer: Building javascript bundle"
yarn build


echo "Warblizer: Building War File"
WARRING="warbilizing" RAILS_ENV=production jruby -S bundle exec warble war

echo "Warblizer: Changing permissions and war file name"
chmod +r "$APPNAME.war"
mv -v "$APPNAME.war" "$APPNAME.war.`git describe --always`"

mkdir -v $PACKAGEDIR
cp -Rv db_scripts $PACKAGEDIR
cp -v CHANGELOG.md $PACKAGEDIR
cp -v INSTALL.md $PACKAGEDIR
cp -v $WARFILE $PACKAGEDIR
zip -rq "$PACKAGEDIR-$GIT_COMMIT_HASH.zip" $PACKAGEDIR
rm -rf $PACKAGEDIR
echo "Packager: Created $PACKAGEDIR-$GIT_COMMIT_HASH.zip"

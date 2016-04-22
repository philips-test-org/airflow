#!/bin/bash

CWD=`pwd`
APPNAME=`cat config/application.name`
VERSION=`git describe --always`
WARFILE="$APPNAME.war.$VERSION"
PACKAGEDIR="$APPNAME-$VERSION"

if [ ! -e $WARFILE ]
then
  echo "Packager: $WARFILE not present."
  read -p "Would you like to build now? (yN)  "
  [[ $REPLY = [yY] ]] && ./warblizer.sh || echo "Packager: $WARFILE will not built"
fi
if [ ! -e $WARFILE ]
then
  echo "Packager: $WARFILE not present, exiting"
  exit 2
fi

if [ -e $PACKAGEDIR ]
then
  echo "Packager: Please remove or rename $PACKAGEDIR"
  exit 2
fi

mkdir -v $PACKAGEDIR
cp -Rv db_scripts $PACKAGEDIR
cp -v CHANGELOG.md $PACKAGEDIR
cp -v $WARFILE $PACKAGEDIR
zip -rq $PACKAGEDIR.zip $PACKAGEDIR
rm -rf $PACKAGEDIR
echo "Packager: Created $PACKAGEDIR.zip"

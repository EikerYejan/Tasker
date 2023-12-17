#!/bin/sh

export HOMEBREW_NO_INSTALL_CLEANUP=TRUE

# Move to the root of the repository
cd /Volumes/workspace/repository

brew install cocoapods
# have to add node yourself
brew install node@20
# link it to the path
brew link node@20

brew install yarn

# Install dependencies you manage with CocoaPods.
yarn

yarn expo prebuild --platform ios

cd ./ios

pod install
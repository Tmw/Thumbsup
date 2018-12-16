**warning** this repository is archived.
# Thumbsup :+1:

A Google Chrome and Apple Safari extension to hide those pesky streams of +1's and :+1:'s in Github issues.

## Using
- Safari users can go [here](https://github.com/Tmw/Thumbsup/releases/tag/1.0) and download the installable plugin
- Chrome users need to clone, build and install manually (for now)

## The setup
- Written in ES6 using Babel
- Built with Gulp
- Tested with Karma, Jasmine and PhantomJS

## Building yourself
- Clone the project
- `cd thumbsup` into project folder
- run `npm install` and wait for it to finish
- run `gulp` to build and run tests
- Safari and Chrome builds will be located in the `dist` folder

### Installing in Chrome
- Enable developer mode in Settings > Extensions
- Click `Load unpacked extension...`
- Select the `dist/chrome` folder created by the gulp task
- Enjoy

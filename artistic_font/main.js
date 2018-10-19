'use strict';

module.exports = {
  load () {
    // execute when package loaded
  },

  unload () {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
    'open' () {
      // open entry panel registered in package.json
      Editor.Panel.open('artistic_font');
    },
    'open_file_plist'(event, data) {
        Editor.log("刷新");
        Editor.assetdb.refresh();
    },

    'clicked' () {
      Editor.log('Button clicked!');
    }
  },
};
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
      Editor.Panel.open('execl_to_json');
    },
    'readJson' () {
      Editor.Ipc.sendToPanel('execl_to_json', 'execl_to_json:readJson');
    },
    'clicked' () {
      Editor.log('Button clicked!');
    }
  },
};
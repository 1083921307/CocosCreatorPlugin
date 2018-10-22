const PACK_NAME = "cocos-packaging"

const fs = require('fire-fs');
let CfgUtil = Editor.require('packages://' + PACK_NAME + '/core/CfgUtil.js');


Editor.Panel.extend({
  // css style for panel
  style:  fs.readFileSync(Editor.url('packages://' + PACK_NAME + '/panel/index.css', 'utf8')) + "",
  // html template for panel
  template:  fs.readFileSync(Editor.url('packages://' + PACK_NAME + '/panel/index.html', 'utf8')) + "",

  // element and variable binding
  $: {
  },

  // method executed when template and styles are successfully loaded and initialized
  ready () {
    // excel_item.init();
    this.plugin = new window.Vue({
      el: this.shadowRoot,
      created() {
          this.initPluginCfg();
      },
      init() {
      },

      data: {
          projectRootPath: null,
          toolRootPath: null,
          isDebug: true,
          isRelease: false,
      },

      methods: {
        onBtnOpenProjectRootPath() {
          let res = Editor.Dialog.openFile({
              title: "选择要保存的目录",
              defaultPath: Editor.projectInfo.path,
              properties: ['openDirectory'],
          });

          if (res !== -1) {
              let dir = res[0];
              if (dir !== this.projectRootPath) {
                  this.projectRootPath = dir;
                  this.saveConfig();
              }
          }
        },

        onBtnOpenToolRootPath() {
          let res = Editor.Dialog.openFile({
              title: "选择要保存的目录",
              defaultPath: Editor.projectInfo.path,
              properties: ['openDirectory'],
          });

          if (res !== -1) {
              let dir = res[0];
              if (dir !== this.toolRootPath) {
                  this.toolRootPath = dir;
                  this.saveConfig();
              }
          }
        },

        onBtnCheckDebug(event) {
            this.isDebug = !this.isDebug;
            this.isRelease = !this.isRelease;
            this.saveConfig();

        },

        onBtnCheckRelease(event) {
          this.isDebug = !this.isDebug;
          this.isRelease = !this.isRelease;
          this.saveConfig();

        },

        saveConfig() {
          let data = {
              projectRootPath: this.projectRootPath,
              toolRootPath: this.toolRootPath,
              isDebug: this.isDebug,
              isRelease: this.isRelease,
          };
          CfgUtil.saveCfgData(data);
        },

        initPluginCfg() {
            CfgUtil.initCfg((data) => {
                if (data) {
                    this.projectRootPath = data.projectRootPath || "";
                    this.toolRootPath = data.toolRootPath || "";
                    this.isDebug = data.isDebug;
                    this.isRelease = data.isRelease;
                }
            })
        }
      }
    });

  },

  // register your ipc messages here
  messages: {
    'cocos-packaging:hello' (event) {
      this.$label.innerText = 'Hello!';
    }
  }
});
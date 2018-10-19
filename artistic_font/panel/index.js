const fs = require('fire-fs');
var exec = require('child_process').exec;
// panel/index.js, this filename needs to match the one registered in package.json

const packageName = "artistic_font";
Editor.Panel.extend({
  // css style for panel
  style: fs.readFileSync(Editor.url('packages://' + packageName + '/panel/index.css', 'utf8')) + "",
  // html template for panel
  template: fs.readFileSync(Editor.url('packages://' + packageName + '/panel/index.html', 'utf8')) + "",

  // element and variable binding
  $: {
    // btn: '#btn',
  },

  // method executed when template and styles are successfully loaded and initialized
    ready () {
       
        this.plugin = new window.Vue({
            el: this.shadowRoot,
            created() {
                // this._initPluginCfg();
            },
            init() {
            },

            data: {
                pngPath: null,
                fontPath: null,
                fontName: null
            },

            methods: {
                onBtnOpenPngPath() {
                    let res = Editor.Dialog.openFile({
                        title: "选择要保存的Font文件",
                        defaultPath: Editor.projectInfo.path,
                        properties: ['openDirectory'],
                    });

                    if (res !== -1) {
                        let dir = res[0];
                        if (dir !== this.fontPath) {
                            this.pngPath = dir;
                        }
                    }
                },

                onBtnOpenFontPath() {
                    let res = Editor.Dialog.openFile({
                        title: "选择要保存的Font文件",
                        defaultPath: Editor.projectInfo.path,
                        properties: ['openDirectory'],
                    });

                    if (res !== -1) {
                        let dir = res[0];
                        if (dir !== this.fontPath) {
                            this.fontPath = dir;
                        }
                    }
                },

                onBtnCreatePng() {
                    if (!this.fontName || !this.pngPath || !this.fontPath) {
                        Editor.log("配置不全。。。");
                        return;
                    }
                    var temp = process.env,
                    environment = {};
                    environment.PATH = temp.PATH+":/usr/local/bin";
                    var option = {
                        env: environment
                    }
                    let cmdStr = `TexturePacker`
                                + ` --format cocos2d`
                                + ` --data ${this.pngPath}/${this.fontName}.plist`
                                + ` --texture-format png`
                                + ` --sheet ${this.pngPath}/${this.fontName}.png`
                                + ` --opt RGBA8888`
                                + ` --max-size  2048`
                                + ` --size-constraints AnySize`
                                + ` --algorithm Basic`
                                + ` --disable-rotation`
                                + ` --trim-mode None`
                                + ` --disable-auto-alias`
                                + ` ${this.pngPath}`;
                    exec(cmdStr, option, function(err,stdout,stderr){
                        if (err) {
                            Editor.log("create png faile " +   stderr);
                            return;
                        }

                        Editor.log("create png success !!!");
                    });
                },

                onBtnCreateFont() {
                    if (!this.fontName || !this.pngPath || !this.fontPath) {
                        Editor.log("配置不全。。。");
                        return;
                    }
                    let cmdStr = `${Editor.projectInfo.path}/packages/artistic_font/res/plist2fnt-macos` 
                        + ` ${this.pngPath}/${this.fontName}.plist`
                        + ` && cp -rf  ${this.pngPath}/${this.fontName}.fnt ${this.fontPath}`
                        + ` && cp -rf  ${this.pngPath}/${this.fontName}.png ${this.fontPath}`
                        + ` && rm -rf  ${this.pngPath}/${this.fontName}.png`
                        + ` && rm -rf  ${this.pngPath}/${this.fontName}.fnt`
                        + ` && rm -rf  ${this.pngPath}/${this.fontName}.plist`;
                    exec(cmdStr, function(err,stdout,stderr){
                        if (err) {
                            Editor.log("create bmfont faile " +   stderr);
                            return;
                        }
                        // Editor.Ipc.sendToMain("artistic_font:open_file_plist")
                        //Editor.I
                       // Editor.remote.assetdb.create(`${this.fontPath}/${this.fontName}.png`, `${this.fontName}.png`, () => {})
                        // Editor.assetdb.refresh(`${this.fontPath}/${this.fontName}.png`);
                        // Editor.assetdb.refresh(`${this.fontPath}/${this.fontName}.plist`);
                        //Editor.remote.assetdb.refresh();
                        Editor.log("create bmfont success !!!");
                    });
                }
            }
        });

  


   
    // this.$btnSelect.addEventListener('confirm', () => {
    //    
    // });

    // this.$btnCreate.addEventListener('confirm', () => {
    //     Editor.log(">>> ::: hel  " + this.$label_plist.innerText);
    //     Editor.log(">>> ::: hel  " + this.$label_font.innerText);
    //     var exec = require('child_process').exec;
    //     let cmdStr = `${Editor.projectInfo.path}/packages/artistic_font/res/plist2fnt-macos  ${this.$label_plist.innerText}`;
    //     exec(cmdStr, function(err,stdout,stderr){
    //           if (err) {
    //               Editor.log("create bmfont faile " +   stderr);
    //               return;
    //           }

    //           Editor.log("create bmfont success !!!");
    //     });
    // });


  },

  // register your ipc messages here
  messages: {
    'artistic_font:label_plist' (event, data) {
        this.$label.innerText = data;
     }
  }
});
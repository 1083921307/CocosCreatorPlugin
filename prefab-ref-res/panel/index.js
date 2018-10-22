const PACK_NAME = "prefab-ref-res";
const fs = require('fire-fs');
let CfgUtil = Editor.require('packages://' + PACK_NAME + '/core/CfgUtil.js');

Editor.Panel.extend({
  style: fs.readFileSync(Editor.url('packages://' + PACK_NAME + '/panel/index.css', 'utf8')) + "",
  template: fs.readFileSync(Editor.url('packages://' + PACK_NAME + '/panel/index.html', 'utf8')) + "",

  $: {
  },

  ready () {

    this.plugin = new window.Vue({
      el: this.shadowRoot,
      created() {
          this._initPluginCfg();
      },
      init() {
      },

      data: {
          prefabRootPath: null,
          prefabList: [],
          resList: [],
          resUuidList: [],
      },

      methods: {
          onBtnOpenPrefabRootPath() {
            let res = Editor.Dialog.openFile({
                title: "选择要保存的Font文件",
                defaultPath: Editor.projectInfo.path,
                properties: ['openDirectory'],
            });

            if (res !== -1) {
                let dir = res[0];
                if (dir !== this.prefabRootPath) {
                    this.prefabRootPath = dir;
                    this.readPrefabFiles();
                    this._saveConfig();
                }
            }

          },
          readPrefabFiles() {
              var files = fs.readdirSync(this.prefabRootPath, { encoding: 'utf-8'});
              let prefabList = [];
              files.forEach(item => {
                  if (item.indexOf(".meta") < 0 && item.indexOf(".prefab") >= 0) {
                      prefabList.push(`${this.prefabRootPath}/${item}`);
                  }
              });
              this.prefabList = prefabList;
            
          },

          onBtnLook(event) {
                let newStr = event.target.getAttribute("bb");
                if (!newStr) {
                    Editor.log("查询失败");
                    return;
                }


                fs.readFile(newStr, { encoding: 'utf-8'}, (err, data) => {
                    if (err) {
                        Editor.log("查询失败");
                        return;
                    }
                    let obj = JSON.parse(data);
                    this.resUuidList = [];
                    let list = [];
                    obj.forEach(item => {
                        this._judgeSprite(item, list);
                        this._judgeButton(item, list);

                    });
                    this.resList = list;
                });
          },

            _judgeUuidExsit(uuid) {
                return  !(this.resUuidList.indexOf(uuid) < 0);
            },

            _judgeSprite(item, list) {
                if (item["__type__"] !== "cc.Sprite" || !item["_spriteFrame"] || !item["_spriteFrame"]["__uuid__"]) {
                    return;
                }
                if(this._judgeUuidExsit(item["_spriteFrame"]["__uuid__"])) {
                    return;
                }
                this.resUuidList.push(item["_spriteFrame"]["__uuid__"]);
                Editor.assetdb.queryUrlByUuid(item["_spriteFrame"]["__uuid__"], (err, data) => {
                    if (!err) {
                        list.push(data);
                    }
                });
            },

            _judgeButton(item, list) {
                if (item["__type__"] !== "cc.Button") {
                    return;
                }

                if (item["_N$disabledSprite"] && item["_N$disabledSprite"]["__uuid__"] && !this._judgeUuidExsit(item["_N$disabledSprite"]["__uuid__"])) {
                    Editor.assetdb.queryUrlByUuid(item["_N$disabledSprite"]["__uuid__"], (err, data) => {
                        if (!err) {
                            list.push(data);
                        }
                    });
                }

                if (item["_N$hoverSprite"] && item["_N$hoverSprite"]["__uuid__"] && !this._judgeUuidExsit(item["_N$hoverSprite"]["__uuid__"])) {
                    Editor.assetdb.queryUrlByUuid(item["_N$hoverSprite"]["__uuid__"], (err, data) => {
                        if (!err) {
                            list.push(data);
                        }
                    });
                }

                if (item["_N$normalSprite"] && item["_N$normalSprite"]["__uuid__"]  && !this._judgeUuidExsit(item["_N$normalSprite"]["__uuid__"])) {
                    Editor.assetdb.queryUrlByUuid(item["_N$normalSprite"]["__uuid__"], (err, data) => {
                        if (!err) {
                            list.push(data);
                        }
                    });
                }

                if (item["_N$pressedSprite"] && item["_N$pressedSprite"]["__uuid__"]  && !this._judgeUuidExsit(item["_N$pressedSprite"]["__uuid__"])) {
                    Editor.assetdb.queryUrlByUuid(item["_N$pressedSprite"]["__uuid__"], (err, data) => {
                        if (!err) {
                            list.push(data);
                        }
                    });
                }
            },



          _saveConfig() {
            let data = {
                prefabRootPath: this.prefabRootPath,
                prefabList: this.prefabList,
            };
            CfgUtil.saveCfgData(data);
          },
  
          _initPluginCfg() {
              CfgUtil.initCfg((data) => {
                  if (data) {
                      this.prefabRootPath = data.prefabRootPath || "";
                      this.prefabList = data.prefabList || [];
                  }
              })
          }
      }
    });
  },

  messages: {
    
  }
});
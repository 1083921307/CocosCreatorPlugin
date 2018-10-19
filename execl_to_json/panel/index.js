// panel/index.js, this filename needs to match the one registered in package.json
const packageName = "execl_to_json";

const fs = require('fire-fs');
const xlsx =  Editor.require('packages://' + packageName + '/node_modules/node-xlsx');
let excel_item = Editor.require('packages://' + packageName + '/panel/item/excel_item.js');

var sheetIdx = 0;
function formatCompress(txt,compress){
    var indentChar = '    ';   
    if(/^\s*$/.test(txt)){   
        alert('数据为空,无法格式化! ');   
        return;   
    }   
    try{var data=eval('('+txt+')');}   
    catch(e){   
        alert('数据源语法错误,格式化失败! 错误信息: '+e.description,'err');   
        return;   
    };   
    var draw=[],last=false,This=this,line=compress?'':'\n',nodeCount=0,maxDepth=0;   
       
    var notify=function(name,value,isLast,indent/*缩进*/,formObj){   
        nodeCount++;/*节点计数*/  
        for (var i=0,tab='';i<indent;i++ )tab+=indentChar;/* 缩进HTML */  
        tab=compress?'':tab;/*压缩模式忽略缩进*/  
        maxDepth=++indent;/*缩进递增并记录*/  
        if(value&&value.constructor==Array){/*处理数组*/  
            draw.push(tab+(formObj?('"'+name+'":'):'')+'['+line);/*缩进'[' 然后换行*/  
            for (var i=0;i<value.length;i++)   
                notify(i,value[i],i==value.length-1,indent,false);   
            draw.push(tab+']'+(isLast?line:(','+line)));/*缩进']'换行,若非尾元素则添加逗号*/  
        }else   if(value&&typeof value=='object'){/*处理对象*/  
                draw.push(tab+(formObj?('"'+name+'":'):'')+'{'+line);/*缩进'{' 然后换行*/  
                var len=0,i=0;   
                for(var key in value)len++;   
                for(var key in value)notify(key,value[key],++i==len,indent,true);   
                draw.push(tab+'}'+(isLast?line:(','+line)));/*缩进'}'换行,若非尾元素则添加逗号*/  
            }else{   
                    if(typeof value=='string')value='"'+value+'"';   
                    draw.push(tab+(formObj?('"'+name+'":'):'')+value+(isLast?'':',')+line);   
            };   
    };   
    var isLast=true,indent=0;   
    notify('',data,isLast,indent,false);   
    return draw.join('');   
}


Editor.Panel.extend({
  style: fs.readFileSync(Editor.url('packages://' + packageName + '/panel/index.css', 'utf8')) + "",
  template: fs.readFileSync(Editor.url('packages://' + packageName + '/panel/index.html', 'utf8')) + "",
    

  // element and variable binding
  $: {
  },

  // method executed when template and styles are successfully loaded and initialized
  ready () {
    // excel_item.init();
    this.plugin = new window.Vue({
        el: this.shadowRoot,
        created() {
        },
        init() {
        },

        data: {
            execlPath: null, // execl 文件的根路径
            saveJsonPath: null, // json 保存的根目录
            excelList: [], //  execl 列表
            excelFileArr: [], // execl 工作薄
            excelData: [], // 当前查看 sheet 数据
            excelName: "", // 当前表名
            sheetName: "", // 当前 sheet 名

            isCompress: true, // 压缩
            isTrope: false, // 转义
            isCompressAndTrop: false, // 压缩并转义
        },

        methods: {
            onBtnOpenExeclPath() {
              let res = Editor.Dialog.openFile({
                  title: "选择要保存的目录",
                  defaultPath: Editor.projectInfo.path,
                  properties: ['openDirectory'],
              });

              if (res !== -1) {
                  let dir = res[0];
                  if (dir !== this.execlPath) {
                      this.execlPath = dir;
                      this.readExeclFileList();
                  }
              }
            },

            onBtnOpenSavaJsonPath() {
                let res = Editor.Dialog.openFile({
                    title: "选择要保存的目录",
                    defaultPath: Editor.projectInfo.path,
                    properties: ['openDirectory'],
                });
  
                if (res !== -1) {
                    let dir = res[0];
                    if (dir !== this.saveJsonPath) {
                        this.saveJsonPath = dir;
                    }
                }
            },

            readExeclFileList() {
                this.excelList = [];
                let fileList = fs.readdirSync(`${this.execlPath}`);
                fileList.forEach(item => {
                    if (item.indexOf(".xlsx") > 0) {
                        this.excelList.push(item);
                    }
                });
    
                let count = 0;
                this.excelList.forEach((item) => {
                    let workSheetsFromFile = xlsx.parse(`${this.execlPath}/${item}`);
                    workSheetsFromFile.forEach(item2 => {
                        let itemData =  {
                            idx: count++,
                            isUse: true,
                            fullPath: `${this.execlPath}`,
                            name: `${item}`,
                            sheet: item2.name,
                            content: item2.data,
                        }
                        this.excelFileArr.push(itemData);
                    });
                });
            },

            onBtnLookJson(event) {
                this.excelData = [];
                let index = event.target.getAttribute("bb");
                let newData =  this.excelFileArr[parseInt(index)];
                this.excelData = newData.content;
                this.excelName = newData.name;
                this.sheetName = newData.sheet;
            },

            onBtnAllSheet(event) {
                this.excelFileArr.forEach((item) => {
                    item.isUse = event.detail.value;
                });
            },
            
            onBtnOneSheet(event) {
                let index = parseInt(event.target.textContent);
                this.excelFileArr[index].isUse = event.detail.value;

            },

            onBtnCompress(event) {
                this.isCompress = event.detail.value;
            },

            onBtnTrope(event) {
                this.isTrope = event.detail.value;
            },

            
            onBtnCompressAndTrop(event) {
                this.isCompressAndTrop = event.detail.value;
            },

            onBtnCreateAllJSON(event) {
                sheetIdx = 0;
                this.createAllJson();
            },


            createAllJson() {
                if (!this.saveJsonPath) {
                    Editor.log("选择保存的路径");
                    return;
                }

                if (this.excelFileArr.length <= sheetIdx) {
                    Editor.log("json 全部生产成功 !!!!!");
                    return;
                }
                if (this.excelFileArr[sheetIdx].length < 2 || !this.excelFileArr[sheetIdx].isUse) {
                    sheetIdx++;
                    this.createAllJson();
                    return;
                }

                let table = {};
                // 第一行表的字段
                table['header'] = {};
                let content_data = this.excelFileArr[sheetIdx].content;
                let headTime = content_data[0];
                headTime.forEach((value, index) => {
                    table['header'][`${value}`] = index; 
                });

                // 第三行代表具体的数据
                table['data'] = [];
                for (let idx = 2; idx < content_data.length; idx++) {
                    var itemList = [];
                    if (!content_data[idx] ||  content_data[idx].length == 0) {
                        continue;
                    }
                    content_data[idx] .forEach((item, index) => {
                        itemList.push(item);
                    });
                    table['data'].push(itemList);
                }

                var obj = null;
                if (this.isCompress === true) {
                    obj = formatCompress(JSON.stringify(table, null, 4), true);
                } else {
                    obj = formatCompress(JSON.stringify(table, null, 4), false);
                }
                fs.writeFile(`${this.saveJsonPath}/${this.excelFileArr[sheetIdx].sheet}.json`, obj,{flag:'w',encoding:'utf-8',mode:'0666'}, () => {
                    sheetIdx++;
                    this.createAllJson();
                });
            }

        
        },


      
    });
    
},

    // register your ipc messages here
    messages: {
        'execl_to_json:readJson' (event, data) {

            Editor.log("hello world");
            // Editor.log(this.plugin.data);
            Editor.log(Plugin.data.excelData);
        }
    }

});
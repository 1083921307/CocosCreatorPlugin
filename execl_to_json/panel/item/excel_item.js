let fs = require('fire-fs');
let packageName = "execl_to_json";

module.exports = {
    init() {
        console.log("excel-item 注册组件!");
        Vue.component('excel-item', {
            props: ['data', 'index'],

            template: fs.readFileSync(Editor.url('packages://' + packageName + '/panel/item/excel_item.html', 'utf8')) + "",
            created() {

            },

            methods: {
                onBtnClickUse() {
                    this.data.isUse=!this.data.isUse;
                    console.log("on use: " + this.data.isUse);

                },
                
                onBtnLookJson() {
                    Editor.log("hello world 1");
                    // Editor.log(this.outData.excelData);
                    // Editor.Ipc.sendToMain("execl_to_json:readJson", this.data);
                }
            },
            computed: {},
        });
    }
};
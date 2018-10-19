const fs = require('fs');
const xlsx = require('node-xlsx');

const PATH_ROOT = "/Users/admin/workspace/IdleDots/IdleDotsConfig/execl转json工具/excel";
this.excelList = [];
this.excelFileArr = [];

var fileList = fs.readdirSync(PATH_ROOT);
fileList.forEach(item => {
    if (item.indexOf(".xlsx") > 0) {
        this.excelList.push(item);
    }
});

this.excelList.forEach((item) => {
    workSheetsFromFile = xlsx.parse(`${PATH_ROOT}/${item}`);
    workSheetsFromFile.forEach(item2 => {
        let itemData =  {
            isUse: true,
            fullPath: `${PATH_ROOT}`,
            name: `${item}`,
            sheet: item2.name,
            data: item2.data
        }
        this.excelFileArr.push(itemData);
    });
   
    
})

header = this.excelFileArr[0].data[0];

let a = 10;


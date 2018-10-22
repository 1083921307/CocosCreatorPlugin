const fs = require("fs");

const ROOT_PATH = "/Users/admin/workspace/IdleDots/IdleDots/assets/resources/prefab/game_map/";

const files = fs.readdirSync(ROOT_PATH, { encoding: 'utf-8'});

const prefab_list = [];

files.forEach(item => {
    if (item.indexOf(".meta") < 0 && item.indexOf(".prefab") >= 0) {
        prefab_list.push({path: ROOT_PATH, name: item})
    }
});

const list = fs.readFileSync(`${ROOT_PATH}${prefab_list[0]}`, { encoding: 'utf-8'});

let a = 10;
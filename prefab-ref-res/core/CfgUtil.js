const fs = require("fire-fs");
const path = require("fire-path");
const electron = require("electron");

module.exports = {
    cfgData: {
        prefabRootPath: null, // 项目的跟目录
        prefabList: null,
    },

    initCfg(cb) {
        let configFilePath = this._getAppCfgPath();
        let exists = fs.existsSync(configFilePath);
        if (!exists) {
            if (cb) {
                 cb(null);
            }
            return;
        }

        fs.readFile(configFilePath, 'utf-8', (err, data)  => {
            if (!err) {
                let saveData = JSON.parse(data.toString());
                this.cfgData = saveData;
                if (cb) {
                    cb(saveData);
                }
            }
        });
    },

    saveCfgData(data) {
        this.cfgData.prefabRootPath = data.prefabRootPath;
        this.cfgData.prefabList = data.prefabList;
        this._save();
    },

    _save() {
        let savePath = this._getAppCfgPath();
        fs.writeFileSync(savePath, JSON.stringify(this.cfgData));
    },

    _getAppCfgPath() {
        let userDataPath  = null;
        if (electron.remote) {
            userDataPath =  electron.remote.app.getPath('userData');
        } else {
            userDataPath = electron.app.getPath('userData');
        }
        let tar = Editor.libraryPath;
        tar = tar.replace(/\\/g, '-');
        tar = tar.replace(/:/g, '-');
        tar = tar.replace(/\//g, '-');
        return path.join(userDataPath, "prefab-ref-res" + tar + ".json");
    }
}
const fs = require("fire-fs");
const path = require("fire-path");
const electron = require("electron");

module.exports = {
    cfgData: {
        projectRootPath: null, // 项目的跟目录
        toolRootPath: null,
        isDebug: true,
        isRelease: false,
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
        this.cfgData.projectRootPath = data.projectRootPath;
        this.cfgData.toolRootPath = data.toolRootPath;
        this.cfgData.isDebug = data.isDebug;
        this.cfgData.isRelease = data.isRelease;
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
        return path.join(userDataPath, "cocos-packaging" + tar + ".json");
    }
}
import { app, BrowserWindow, ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
// if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
// }

let mainWindow;
// const winURL = process.env.NODE_ENV === 'development'
//   ? `http://localhost:9080`
//   : `file://${__dirname}/index.html`
  const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  // 尝试更新
  checkForUpdates()
}



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

import { autoUpdater } from 'electron-updater'

ipcMain.on('update', (e, arg)=> {
  checkForUpdates()
})

const feedUrl = ' http://10.37.129.2:8080'; // 更新包位置

let checkForUpdates = () => {
  let message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新',
  };
  // 配置安装包远端服务器
  autoUpdater.setFeedURL(feedUrl);

  // 下面是自动更新的整个生命周期所发生的事件
  autoUpdater.on('error', function(error) {
      sendUpdateMessage(message.error);
  });
  autoUpdater.on('checking-for-update', function(info) {
      sendUpdateMessage(message.checking);
  });
  autoUpdater.on('update-available', function (info) {
    sendUpdateMessage(message.updateAva)
  });
  autoUpdater.on('update-not-available', function (info) {
    sendUpdateMessage(message.updateNotAva)
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function(progressObj) {
    mainWindow.webContents.send('downloadProgress', progressObj)
  });
  // 更新下载完成事件
  autoUpdater.on('update-downloaded', function(event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    ipcMain.on('isUpdateNow', (e, arg) => {
      console.log(arguments);
      console.log("开始更新");
      //some code here to handle event
      autoUpdater.quitAndInstall();
    });

    mainWindow.webContents.send('isUpdateNow')
  });

  ipcMain.on("checkForUpdate",()=>{
    //执行自动更新检查
    autoUpdater.checkForUpdates();
  })

};
// 主进程主动发送消息给渲染进程函数
function sendUpdateMessage(text) {
   mainWindow.webContents.send('message', text)
}


app.on('ready', ()=> createWindow())
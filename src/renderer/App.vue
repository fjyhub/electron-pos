<template>
  <div id="app">
    <!-- <router-view></router-view> -->
      <p>----版本0.0.1</p>
      <button @click="autoUpdate()" style="padding-top:20px">获取更新</button>
        <ol id="content">
            <li>生命周期过程展示</li>
        </ol>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
  export default {
    name: 'electron-pos',
    mounted() {
      const updateOnlineStatus = () => {
        ipcRenderer.send('online-status-changed', navigator.onLine ? 'online' : 'offline')
      }

      window.addEventListener('online',  updateOnlineStatus)
      window.addEventListener('offline',  updateOnlineStatus)
      updateOnlineStatus()
    //  ipcRenderer.send("checkForUpdate");
    //  ipcRenderer.on("message", (event, text) => {
    //         console.log(arguments);
    //         this.tips = text;
    //     });
    //     //注意：“downloadProgress”事件可能存在无法触发的问题，只需要限制一下下载网速就好了
    //     ipcRenderer.on("downloadProgress", (event, progressObj)=> {
    //         console.log(progressObj);
    //         this.downloadPercent = progressObj.percent || 0;
    //     });
    //     ipcRenderer.on("isUpdateNow", () => {
    //       ipcRenderer.send("isUpdateNow");
    //     });
    },
    beforeDestroy() {
        ipcRenderer.removeAll(["message", "downloadProgress", "isUpdateNow"]);
        //remove只能移除单个事件，单独封装removeAll移除所有事件
    },
    methods: {
      autoUpdate() {
        ipcRenderer.send('update');
      }
    }
  }
</script>

<style>
  /* CSS */
</style>

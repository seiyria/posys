'use strict';

const electron = require('electron');
const open = require('open');

const isDev = require('electron-is-dev');
const appRoot = require('app-root-path');

const fs = require('fs');

const {
  app,
  BrowserWindow
} = electron;

try {
  require('electron-debug')({ showDevTools: true });
} catch(e) {
  console.error('Could not load electron-debug');
}

process.on('uncaughtException', function(err) {
  fs.writeFile('error.log', JSON.stringify(err, null, 4));
});

let win;

function createWindow() {
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
    win = new BrowserWindow({
        width,
        height,
        minWidth: 1024,
        minHeight: 768,
        title: 'Posys',
        show: false
    });

    win.once('ready-to-show', () => {
      win.show();
    });

    let url = 'http://localhost:8100';

    var express = require('express');
    var expressApp = express();

    expressApp.use(express.static(__dirname));
    expressApp.listen(30517);

    if(!isDev) {
        url = 'http://localhost:30517/www/index.html';
    }

    win.loadURL(url);

    require('./www/server/index');

    win.webContents.on('new-window', function(event, url) {
      if(_.includes(url, 'localhost')) { return; }
      event.preventDefault();
      open(url);
    });

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

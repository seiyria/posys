'use strict';

const electron = require('electron');
const open = require('open');

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
    win = new BrowserWindow({
        width: 1024,
        height: 768
    });

    win.webContents.on('new-window', function(event, url) {
      event.preventDefault();
      open(url);
    });

    let url = 'http://localhost:8100';
    const args = process.argv.slice(2);
    args.forEach(function(val) {
        if(val === 'dist') {
            url = 'file://' + __dirname + '/www/index.html';
        }
    });

    win.loadURL(url);
    require('./www/server/index');

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

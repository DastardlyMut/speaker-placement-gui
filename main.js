const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function onClosed() {
  // Dereference the window
  // For multiple windows store them in an array
  mainWindow = null;
}

function createMainWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow();
  }
});

app.on('ready', () => {
  mainWindow = createMainWindow();
});


// My xml renderer code ...
// Electron stuff

const {ipcMain} = electron

// The speaker configuration object
var speakerConfig = {
  amplifiers: []                                // configuration contains one or more amplifiers
}

var speakers = [];
// speaker object
function speaker(x,y,z,number){
    this.x = x;
    this.y = y;
    this.z = z;
    this.number = number;
}
// amplifier object
function amplifier(macadr,noSpkrs){
  this.speakers = [];
  this.macadr = macadr;
  this.noSpkrs = noSpkrs
}


// Communication between processes

ipcMain.on('save-macadr', (event, arg) => {
  /* Saving MAC addresses into speakerConfig */
  var noSpkrs = 8;
  for (var i = 0; i < arg.amplifiers.length; i++) {
        var newmac = arg.amplifiers[i].macadr;
        if (speakerConfig.amplifiers[i] == null){
          speakerConfig.amplifiers[i] = new amplifier(newmac,noSpkrs);
        }
        else {
          speakerConfig.amplifiers[i].macadr = newmac;
        }
  }
  console.log('DAC endpoints')
  console.log(speakerConfig.amplifiers)
});

ipcMain.on('save-spkrs', (event, arg) => {
  /* Saving MAC addresses into speakerConfig */
  // Unpack speakers into array
    for (var i = 0; i < arg.length; i++) {
        var x = arg[i].x;
        var y = arg[i].y;
        var z = arg[i].z;
        var no = arg[i].no;
        
        speakers.push(new speaker(x,y,z,no));
    }

    var k = 0;
    for (var i = 0; i < speakerConfig.amplifiers.length; i++){
        for (var j = 0; j < 8; j++){
            console.log(speakerConfig.amplifiers[i].speakers);
            console.log(speakers[k])
            speakerConfig.amplifiers[i].speakers[j] = speakers[k];
            k++;
        }
    }
    console.log('speakers saved')
});

ipcMain.on('render-xml', (event,arg)=> {
    console.log('xml finished rendering')
})






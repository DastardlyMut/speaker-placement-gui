const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

var windowArray = [];
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let editorWindow

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

  // Add to windowArray
  mainWindow.name = 'main-window';
  windowArray.push(mainWindow);
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
  editorWindow = createEditorWindow();
});

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


// Config Editor
function createEditorWindow(){
  const modalPath = path.join('file://', __dirname, '/sections/speakers/config-editor.html')
  editorWindow = new BrowserWindow({ width: 400, height: 320 })
  editorWindow.loadURL(modalPath)
  editorWindow.on('close', (event) => { 
    console.log('closing')
    // editorWin.hide()
    event.preventDefault()
    getWindow('config-editor').hide() 
    // editorWindow = null;
  })
  console.log('editor window created')
  editorWindow.name = "config-editor"
  windowArray.push(editorWindow);
  editorWindow.hide();
}
 
// Communication between processes
ipcMain.on('open-config-editor', (event,arg) =>{
  // console.log('here')
  // console.log(windowArray)
  // const modalPath = path.join('file://', __dirname, '/sections/speakers/config-editor.html')
  // let editorWin = new BrowserWindow({ width: 400, height: 320 })
  // editorWin.loadURL(modalPath)
  // editorWin.on('close', (event) => { 
  //   console.log('closing')
  //   // editorWin.hide()
  //   event.preventDefault()
  //   editorWin.hide() })
  // editorWin.name = "config-editor"
  // editorWin.show();
  // windowArray.push(editorWin);
  //console.log(windowArray[1])
  getWindow('config-editor').show()
})


// ipcMain.on('add-window-array', (event,arg) =>{
//   console.log(arg)
//   // console.log(arg.webContents)
//   windowArray.push(arg)
//   console.log("window name " + arg.name)
//   console.log('added window to array')
// });

// ipcMain.on('update-config-editor', (event,arg) => {
//     console.log('update-config-editor');
//     //console.log(windowArray)
//     // console.log(webContents.fromId(0).name)
//     //console.log("webContents " + getWindow('config-editor').webContents)
//    // console.log(getWindow('config-editor').name)
//     //getWindow('config-editor').webContents.send('send-amp-info' , {msg:speakerConfig});
// })

function getWindow(windowName) {
  for (var i = 0; i < windowArray.length; i++) {
    if (windowArray[i].name == windowName) {
      return windowArray[i];
    }
  }
  return null;
} 

// Saving macadr info
ipcMain.on('save-macadr', (event, arg) => {
  /* Saving MAC addresses into speakerConfig */
  // var noSpkrs = 8;
  console.log(arg)
  for (var i = 0; i < arg.amplifiers.length; i++) {
        var newmac = arg.amplifiers[i].macadr;
        var noSpkrs = arg.amplifiers[i].noSpkrs;
        console.log("amp  " + i + "    " + noSpkrs)
        if (speakerConfig.amplifiers[i] == null){
          speakerConfig.amplifiers[i] = new amplifier(newmac,noSpkrs);
        }
        else {
          speakerConfig.amplifiers[i].macadr = newmac;
          speakerConfig.amplifiers[i].noSpkrs = noSpkrs;
        }
  }
  console.log('DAC endpoints')
  console.log(speakerConfig.amplifiers)
});

ipcMain.on('save-spkrs', (event, arg) => {
  /* Saving MAC addresses into speakerConfig */
  speakers = [];
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
        for (var j = 0; j < speakerConfig.amplifiers[i].noSpkrs; j++){
            console.log(speakerConfig.amplifiers[i].speakers);
            console.log(speakers[k])
            speakerConfig.amplifiers[i].speakers[j] = speakers[k];
            k++;
        }
    }
    console.log('speakers saved')
});

var xml = require('xml')
var fs = require('fs')

ipcMain.on('render-xml', (event,arg)=> {
    console.log('render starting')
    // Create XML object containing correct tags and data
    // Preamble

    // Create string to be printed to xml
    var spkno = 0;
    var string = "";
    string += '<?xml version="1.0" encoding="UTF-8"?>\n<config>\n'
    //fs.appendFile('SpeakerConfig-new.xml' , '<?xml version="1.0" encoding="UTF-8"?>\n<config>\n', (err) => { if(err) throw err})
    for (var i = 0; i < speakerConfig.amplifiers.length; i++){
      var mac = speakerConfig.amplifiers[i].macadr;
      spk_no = 0; 
      // console.log(mac)
      // fs.appendFile('SpeakerConfig-new.xml', 
      //   '   <amplifier macadr = "' + mac + '">\n', (err) => { if(err) throw err})
      string +=  '   <amplifier macadr = "' + mac + '">\n'; 
        for (var j = 0; j < speakerConfig.amplifiers[i].speakers.length; j++){
          var spk = speakerConfig.amplifiers[i].speakers[j];
          spk_no++;
          if (spk !== undefined){
            // var string = '      <speaker number = "' + spk.number + '"  xpos = "' + spk.x + '"  ypos = "' + spk.y + '" zpos = "' + spk.z + "\"> </speaker>\n"
            string += '      <speaker number = "' + spk_no + '"  xpos = "' + spk.x + '"  ypos = "' + spk.y + '" zpos = "' + spk.z + "\"> </speaker>\n"

            //  fs.appendFile('SpeakerConfig-new.xml', string, (err) => { if(err) throw err});
          }
        }
      string += '   </amplifier>\n';
      // fs.appendFile('SpeakerConfig-new.xml', 
      //   '   </amplifier>\n', (err) => { if(err) throw err} )
    }
    string += '</config>\n';
    //fs.appendFile('SpeakerConfig-new.xml' , '</config>\n', (err) => { if(err) throw err})

    console.log(speakerConfig.amplifiers)
    fs.open('SpeakerConfig-new.xml', 'w+' , function (err,file){
      if (err) throw err;
    })
    fs.writeFile('SpeakerConfig-new.xml', string, (err) =>{
      if (err) throw err
      console.log('SpeakerConfig-new.xml saved')
    })
    // var spkno = 0;
    // fs.appendFile('SpeakerConfig-new.xml' , '<?xml version="1.0" encoding="UTF-8"?>\n<config>\n', (err) => { if(err) throw err})
    // for (var i = 0; i < speakerConfig.amplifiers.length; i++){
    //   var mac = speakerConfig.amplifiers[i].macadr;
    //   spk_no = 0; 
    //   console.log(mac)
    //   fs.appendFile('SpeakerConfig-new.xml', 
    //     '   <amplifier macadr = "' + mac + '">\n', (err) => { if(err) throw err})
    //     for (var j = 0; j < speakerConfig.amplifiers[i].speakers.length; j++){
    //       var spk = speakerConfig.amplifiers[i].speakers[j];
    //       spk_no++;
    //       if (spk !== undefined){
    //         // var string = '      <speaker number = "' + spk.number + '"  xpos = "' + spk.x + '"  ypos = "' + spk.y + '" zpos = "' + spk.z + "\"> </speaker>\n"
    //         var string = '      <speaker number = "' + spk_no + '"  xpos = "' + spk.x + '"  ypos = "' + spk.y + '" zpos = "' + spk.z + "\"> </speaker>\n"

    //           fs.appendFile('SpeakerConfig-new.xml', string, (err) => { if(err) throw err});
    //       }
    //     }
    //   fs.appendFile('SpeakerConfig-new.xml', 
    //     '   </amplifier>\n', (err) => { if(err) throw err} )
    // }
    // fs.appendFile('SpeakerConfig-new.xml' , '</config>\n', (err) => { if(err) throw err})
    console.log('xml finished rendering')
})






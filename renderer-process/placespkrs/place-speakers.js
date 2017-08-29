// Electron
const {ipcRenderer} = require('electron')
const BrowserWindow = require('electron').remote.BrowserWindow
const path = require('path')


/* Helper function */

function getID(id){
	return document.getElementById(id);
}

/* Main code */

// open-config-editor handler

const btn_openConfigEditor = getID('open-config-editor')

btn_openConfigEditor.addEventListener('click', function (event) {
  const modalPath = path.join('file://', __dirname, '../../sections/speakers/config-editor.html')
  let win = new BrowserWindow({ width: 400, height: 320 })
  win.on('close', function () { win = null })
  win.loadURL(modalPath)

  win.show()
})

const btn_renderXML = getID('render-xml')

btn_renderXML.addEventListener('click', function (event) {
  //const modalPath = path.join('file://', __dirname, '../../sections/speakers/config-editor.html')
  // let win = new BrowserWindow({ width: 400, height: 320 })
  // win.on('close', function () { win = null })
  // win.loadURL(modalPath)

  // win.show()
  // Call XML renderer
  ipcRenderer.send('render-xml');
})
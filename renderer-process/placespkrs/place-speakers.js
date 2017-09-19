// Electron
const {ipcRenderer} = require('electron')
const {remote} = require('electron')
const {Menu, MenuItem} = remote
const BrowserWindow = require('electron').remote.BrowserWindow
const path = require('path')

const template = [
  {
    label: 'File',
    submenu : [
      {role: 'open'},
      {role: 'save'},
      {role: 'clear'},
      {role: 'close'},
    ]
  }]
  // {
  //   label: 'Edit',
  //   submenu: [
  //     {role: 'undo'},
  //     {role: 'redo'},
  //     {type: 'separator'},
  //     {role: 'cut'},
  //     {role: 'copy'},
  //     {role: 'paste'},
  //     {role: 'pasteandmatchstyle'},
  //     {role: 'delete'},
  //     {role: 'selectall'}
  //   ]
  // },
  // {
  //   label: 'View',
  //   submenu: [
  //     {role: 'reload'},
  //     {role: 'forcereload'},
  //     {role: 'toggledevtools'},
  //     {type: 'separator'},
  //     {role: 'resetzoom'},
  //     {role: 'zoomin'},
  //     {role: 'zoomout'},
  //     {type: 'separator'},
  //     {role: 'togglefullscreen'}
  //   ]
  // },
  // {
  //   role: 'window',
  //   submenu: [
  //     {role: 'minimize'},
  //     {role: 'close'}
  //   ]
  // },



// if (process.platform === 'darwin') {
//   template.unshift({
//     label: app.getName(),
//     submenu: [
//       {role: 'about'},
//       {type: 'separator'},
//       {role: 'services', submenu: []},
//       {type: 'separator'},
//       {role: 'hide'},
//       {role: 'hideothers'},
//       {role: 'unhide'},
//       {type: 'separator'},
//       {role: 'quit'}
//     ]
//   })

//   // Edit menu
//   template[1].submenu.push(
//     {type: 'separator'},
//     {
//       label: 'Speech',
//       submenu: [
//         {role: 'startspeaking'},
//         {role: 'stopspeaking'}
//       ]
//     }
//   )

//   // Window menu
//   template[3].submenu = [
//     {role: 'close'},
//     {role: 'minimize'},
//     {role: 'zoom'},
//     {type: 'separator'},
//     {role: 'front'}
//   ]


// const menu = Menu.buildFromTemplate(template)
/* Helper function */

function getID(id){
	return document.getElementById(id);
}

const btn_enterDim = getID('button-enterdim');

btn_enterDim.addEventListener('click', function(event){
    // Get values from button
    var length = getID('length-box').value
    var height = getID('height-box').value
    var width = getID('width-box').value
    
    console.log(length)
    console.log(height)
    console.log(width)
    var roomDim = {
      'length' : length,
      'width' : width,
      'height' : height
    }
    console.log(roomDim)
    // Send values to main process
    ipcRenderer.send('button-enterdim',roomDim)
})

const btn_openConfigEditor = getID('open-config-editor')

btn_openConfigEditor.addEventListener('click', function (event) {
      ipcRenderer.send('open-config-editor')
})

const btn_renderXML = getID('render-xml')

btn_renderXML.addEventListener('click', function (event) {
  // Call XML renderer
  ipcRenderer.send('render-xml');
})
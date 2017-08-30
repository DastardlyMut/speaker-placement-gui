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

/* Main code */
// let editorWin = new BrowserWindow({ width: 400, height: 320 })
// editorWin.hide()
// editorWin.on('close', function () { editorWin.hide() })
// editorWin.onbeforeunload = function (e) { 
//   return false}
// open-config-editor handler

const btn_openConfigEditor = getID('open-config-editor')

// const modalPath = path.join('file://', __dirname, '../../sections/speakers/config-editor.html')
// let editorWin = new BrowserWindow({ width: 400, height: 320 })
// editorWin.loadURL(modalPath)
// editorWin.on('close', (event) => { 
//   console.log('closing')
//   // editorWin.hide()
//   event.preventDefault()
//   editorWin.hide() })
// editorWin.name = "config-editor"
// win.setMenu(menu)  

// window.addEventListener('contextmenu', (e) => {
//   e.preventDefault()
//   menu.popup(remote.getCurrentWindow())
// }, false)
// console.log('show window')
// editorWin.hide()

// ipcRenderer.send('add-window-array', editorWin);
// const modalPath = path.join('file://', __dirname, '../../sections/speakers/config-editor.html')
// let editorWin = new BrowserWindow({ width: 400, height: 320 })
// editorWin.loadURL(modalPath)
// editorWin.hide()
// editorWin.on('close', function () { 
//   // preventDefault()
//   editorWin.hide() })
// editorWin.onbeforeunload = function (e){
//   console.log('here')
//   return false
// }
// editorWin.onbeforeunload = (e) => {
//   var answer = confirm('Do you really want to close the application?');
//   e.returnValue = answer;  // this will *prevent* the closing no matter what value is passed
//   if(answer) { win.destroy(); }  // this will close the app
// };
// editorWin.name = "config-editor"
// ipcRenderer.send('add-window-array', editorWin);

//var windowOpen = false;

btn_openConfigEditor.addEventListener('click', function (event) {
      // const modalPath = path.join('file://', __dirname, '../../sections/speakers/config-editor.html')
      // let editorWin = new BrowserWindow({ width: 400, height: 320 })
      // editorWin.loadURL(modalPath)
      // editorWin.on('close', function (event) { 
      //   console.log(event)
      //   event.preventDefault()
      //   editorWin.hide() })
      // editorWin.name = "config-editor"
      // // win.setMenu(menu)  

      // // window.addEventListener('contextmenu', (e) => {
      // //   e.preventDefault()
      // //   menu.popup(remote.getCurrentWindow())
      // // }, false)
      ipcRenderer.send('open-config-editor')
      // console.log('show window')
      // editorWin.show()
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
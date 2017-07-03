'use strict';

const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
global.mainWindow = null

function createWindow () {
	// Create the browser window.
	global.mainWindow = new BrowserWindow({width: 800, height: 600})

	// and load the index.html of the app.
	global.mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));

	// Open the DevTools.
	// global.mainWindow.webContents.openDevTools()

	// Emitted when the window is closed.
	global.mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		global.mainWindow = null
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		////////////////////////////////////////////////////////////////////////////////
		// Should remove all buy orders before exiting.
		////////////////////////////////////////////////////////////////////////////////

		app.quit()
	}
});

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (global.mainWindow === null) {
		createWindow()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Get redis up, for queue system.
////////////////////////////////////////////////////////////////////////////////
// const RedisServer = require('redis-server')
//     , server = new RedisServer(6379);
 
// server.open((err) => {
//   if (err === null) {
//     // You may now connect a client to the Redis
//     // server bound to `server.port` (e.g. 6379).
//   } else {
//     console.log('RedisServer `Open` error')
//     console.log(err)
//   }
// });

const gdaxsocket = require('./js/websocket.js')
const {ipcMain} = require('electron')

// let mainValue = ipcRenderer.sendSync('isWebSocketAuthenticated');
ipcMain.on('isWebSocketAuthenticated', (event) => {
	event.returnValue = gdaxsocket.authenticated;
});

ipcMain.on('getOrder', (event, order_id) => {
	event.returnValue = gdaxsocket.orders.getOrder(order_id);
});

ipcMain.on('getOrders', (event) => {
	event.returnValue = gdaxsocket.orders.getOrders();
});

ipcMain.on('getWebsocketBytesReceived', (event, order_id) => {
	// event.returnValue = gdaxsocket.websocket.bytesReceived;
	event.returnValue = 999999;
});

ipcMain.on('isOrderMine', (event, order_id) => {
	event.returnValue = gdaxsocket.orders.isOrderMine(order_id);
});
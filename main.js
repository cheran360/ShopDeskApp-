const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

// Listen for app to be ready
app.on("ready", function () {
  // Create a new window
  mainWindow = new BrowserWindow({});
  // Load html file into the window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "mainWindow.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  // Quit app when closed
  mainWindow.on("closed", function () {
    app.quit();
  });

  // Build the menu from the template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});

// Handle create add window
function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: "Add Shopping List Item",
  });
  // Load html file into the window
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "addWindow.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  addWindow.on("close", function () {
    addWindow = null;
  });
}
// Catch item:add
ipcMain.on("item:add", function (e, item) {
  console.log(item);
  mainWindow.webContents.send("item:add", item);
  addWindow.close();
});

// Create menu template, Basically an array of objs
const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Add Item",
        click() {
          createAddWindow();
        },
      },
      {
        label: "Clear Items",
      },
      {
        label: "Quit",
        accelerator: process.platform == "darwin" ? "Command-Q" : "Ctrl + Q",
        click() {
          app.quit();
        },
      },
    ],
  },
];

// If platform mac, add empty object to menu
if (process.platform == "darwin") {
  mainMenuTemplate.unshift({});
}

// add developer tools item if not in production
if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle Developer Tools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",

        // we want developer console on what window we are working in
        // eg. mainWindow console should generate on mainwindow not on the
        // side window or add window..
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: "reload",
      },
    ],
  });
}

const { app, globalShortcut } = require('electron');
const electron = require('electron');
const bw = electron.BrowserWindow;
const path = require('path');
const url = require('url');

app.on("ready", function () {

    var main_window = new bw();

    main_window.loadURL(url.format({
        pathname: path.join(__dirname, "src/windows/index.html"),
        protocol: "file:",
        slashes: true
    }));

    main_window.on("closed", function () {
        main_window = null;
        app.exit();
    });

    app.on('window-all-closed', function () {
        app.quit();
    });

    main_window.maximize();
});
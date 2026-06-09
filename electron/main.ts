import { app, BrowserWindow, Menu } from "electron";
import path from "path";
import {registerAuthIpc} from "./ipc/auth.ipc";
import {registerAiIpc} from "./ipc/ai.ipc";

let win: BrowserWindow | null = null;
// Menu.setApplicationMenu(null);

const createWindow = () => {
    if (win) return;
    win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });

    win.loadURL("http://localhost:5173");
};

app.whenReady().then(() => {
    registerAuthIpc();
    registerAiIpc();
    createWindow();
});
import { app, BrowserWindow, Menu, session  } from "electron";
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

    const isDev = !app.isPackaged

    const csp = isDev
        ? [
            "default-src 'self';",
            "script-src 'self' 'unsafe-inline';",
            "style-src 'self' 'unsafe-inline';",
            "connect-src 'self' http://127.0.0.1:8090 http://127.0.0.1:3000 ws://localhost:5173;",
            "img-src 'self' data:;",
            "font-src 'self';",
        ].join(' ')
        : [
            "default-src 'self';",
            "script-src 'self';",
            "style-src 'self' 'unsafe-inline';",
            "connect-src 'self' http://127.0.0.1:8090 http://127.0.0.1:3000;",
            "img-src 'self' data:;",
            "font-src 'self';",
        ].join(' ')

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [csp],
            },
        })
    })
});
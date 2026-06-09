import { ipcMain } from "electron"
import { tokenStorage } from "../storage/token.storage"

export const registerAuthIpc = () => {

    ipcMain.handle("auth:save-token", (_, token: string) => {
        tokenStorage.save(token)
    })

    ipcMain.handle("auth:load-token", () => {
        return tokenStorage.load()
    })

    ipcMain.handle("auth:clear-token", () => {
        tokenStorage.clear()
    })
}
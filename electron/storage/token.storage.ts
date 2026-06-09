import { safeStorage, app } from "electron"
import fs from "fs"
import path from "path"

const TOKEN_PATH = path.join(app.getPath("userData"), "token.enc")

export const tokenStorage = {
    save(token: string) {
        const encrypted = safeStorage.encryptString(token)
        fs.writeFileSync(TOKEN_PATH, encrypted)
    },

    load(): string | null {
        if (!fs.existsSync(TOKEN_PATH)) return null

        const encrypted = fs.readFileSync(TOKEN_PATH)

        try {
            return safeStorage.decryptString(encrypted)
        } catch {
            return null
        }
    },

    clear() {
        if (fs.existsSync(TOKEN_PATH)) {
            fs.unlinkSync(TOKEN_PATH)
        }
    }
}
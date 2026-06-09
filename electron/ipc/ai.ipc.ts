import { ipcMain } from 'electron'

export const registerAiIpc = () => {
    ipcMain.handle('ai:chat', async (_, message: string): Promise<string> => {
        try {
            const res = await fetch('http://127.0.0.1:3000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            })
            if (!res.ok) throw new Error(`Mock AI error: ${res.status}`)

            const data = await res.json() as { reply: string }
            return data.reply
        } catch (error) {
            console.log('ai:chat failed:', error)
            throw error
        }

    })
}
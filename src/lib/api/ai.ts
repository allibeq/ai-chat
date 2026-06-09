export async function callAI(message: string): Promise<string> {
    const reply = await window.electron.callAI(message)
    if (!reply) throw new Error('Empty response from AI server.')
    return reply
}
const fs = require('node:fs')
const path = require('node:path')

const dir = path.join(__dirname, 'replies')

const replies = fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => fs.readFileSync(path.join(dir, f), 'utf8'))

function getMockAiReply() {
    return replies[Math.floor(Math.random() * replies.length)]
}

module.exports = { getMockAiReply, replies }
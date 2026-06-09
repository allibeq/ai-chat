const http = require('http');
const { getMockAiReply } = require('./replies')

http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'POST' && req.url === '/chat') {
        let body = '';

        req.on('data', chunk => body += chunk);

        req.on('end', () => {
            const { message = '' } = JSON.parse(body || '{}');

            const delay = Math.random() * 3000;
            setTimeout(() => {
                res.end(JSON.stringify({
                    id: crypto.randomUUID(),
                    model: 'mock-gpt',
                    role: 'agent',
                    reply: getMockAiReply(),
                    timestamp: Date.now()
                }))
            }, delay)
        });

        return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
}).listen(3000, () => {
    console.log('Listening on http://localhost:3000');
});

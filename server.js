// Simple HTTP server for Yeti Games landing page
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8000;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    let filePath = '.' + req.url;
    
    // Handle cowboy-shootout game routes
    if (req.url.startsWith('/cowboy-game')) {
        // Redirect /cowboy-game to the actual game files
        filePath = './cowboy-shootout/public' + req.url.replace('/cowboy-game', '');
        if (filePath === './cowboy-shootout/public/') {
            filePath = './cowboy-shootout/public/index.html';
        }
    } else if (filePath === './') {
        filePath = './index.html';
    }
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                        <head><title>404 - Not Found</title></head>
                        <body style="font-family: Arial, sans-serif; text-align: center; margin: 50px;">
                            <h1>🚫 404 - File Not Found</h1>
                            <p>The requested file "${req.url}" was not found.</p>
                            <p><a href="/">← Back to Yeti Games</a></p>
                        </body>
                    </html>
                `);
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            // Successful response
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-cache' // Prevent caching during development
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, () => {
    console.log('🎮 YETI GAMES SERVER STARTED');
    console.log('================================');
    console.log(`🌐 Server running at: http://localhost:${port}/`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log('================================');
    console.log('🚀 Open your browser and navigate to the URL above!');
    console.log('Press Ctrl+C to stop the server');
    console.log('');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down Yeti Games server...');
    server.close(() => {
        console.log('✅ Server stopped successfully!');
        process.exit(0);
    });
});

// Error handling
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`❌ Port ${port} is already in use!`);
        console.log(`💡 Try: lsof -ti:${port} | xargs kill -9`);
        console.log(`Or use a different port by editing server.js`);
    } else {
        console.log('❌ Server error:', err);
    }
});
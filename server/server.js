
require('dotenv').config();
const http = require('http');

const app = require('./src/app');
const connectDB = require('./src/config/db');
const { initSocket } = require('./src/sockets/socketServer');

const PORT = process.env.PORT || 5000;


const startServer = async () => {
 
  await connectDB();


  const server = http.createServer(app);
  initSocket(server);

  server.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════╗
    ║                                           ║
    ║   🚀 FreelanceHub Server is Running!      ║
    ║                                           ║
    ║   Port: ${PORT}                            ║
    ║   Mode: ${process.env.NODE_ENV}               ║
    ║   URL:  http://localhost:${PORT}           ║
    ║                                           ║
    ╚═══════════════════════════════════════════╝
    `);
  });
};


startServer();
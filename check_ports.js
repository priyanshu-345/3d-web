const net = require('net');

const checkPort = (port) => {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(2000);
        socket.on('connect', () => {
            console.log(`Port ${port} is OPEN`);
            socket.destroy();
            resolve(true);
        });
        socket.on('timeout', () => {
            console.log(`Port ${port} is TIMEOUT`);
            socket.destroy();
            resolve(false);
        });
        socket.on('error', (err) => {
            console.log(`Port ${port} is CLOSED (${err.message})`);
            resolve(false);
        });
        socket.connect(port, '127.0.0.1');
    });
};

(async () => {
    /* Wait a bit for the process to bind */
    await new Promise(r => setTimeout(r, 2000));
    await checkPort(5176);
    await checkPort(5000);
})();

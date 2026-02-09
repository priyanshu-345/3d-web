const net = require('net');

const checkPort = (port, host) => {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(1000);
        socket.on('connect', () => {
            console.log(`Port ${port} on ${host} is OPEN`);
            socket.destroy();
            resolve(true);
        });
        socket.on('timeout', () => {
            // console.log(`Port ${port} on ${host} is TIMEOUT`);
            socket.destroy();
            resolve(false);
        });
        socket.on('error', (err) => {
            // console.log(`Port ${port} on ${host} is CLOSED (${err.message})`);
            resolve(false);
        });
        socket.connect(port, host);
    });
};

(async () => {
    const ports = [5173, 5174, 5175, 5176, 5177, 5000];
    const hosts = ['127.0.0.1', '::1'];

    for (const port of ports) {
        for (const host of hosts) {
            await checkPort(port, host);
        }
    }
})();

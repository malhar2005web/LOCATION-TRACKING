const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
    console.log('SSH Connection ready. Deploying...');
    conn.exec('cd /var/www/LOCATION-TRACKING && git pull origin main && pm2 restart all', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log('Stream closed with code ' + code);
            conn.end();
            process.exit(0);
        }).on('data', (data) => {
            console.log('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
        });
    });
}).connect({
    host: '173.249.59.181',
    port: 22,
    username: 'root',
    password: 'V5PGnTa3aX70'
});

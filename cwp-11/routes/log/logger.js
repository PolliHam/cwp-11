let LogPath = './logs.txt';
let fs = require('fs');
let File;
fs.open(LogPath, 'w', function (err, fd) {
    File = fd;
});
function log(data) {
    let date = new Date();
    fs.appendFile(File, date.toLocaleString() + ": \r\n" + data + '\r\n', function (err) {
        if (err) {
        }
    });
}

module.exports = {
    log
}
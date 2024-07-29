const { exec } = require('child_process');

const illegal = [
    "",
    " ",
    
]
function search(query) {
    const command = `C:\\Users\\Jooapa\\Documents\\GitHub\\Lighthouse\\backend\\beacon.exe ${query}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        return stdout;
    });
}

module.exports = {
    search,
};
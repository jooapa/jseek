const { spawn } = require('child_process');
const { debug } = require('./config');

let currentJseekProcess = null;

function search(query) {
    let command;
    if (debug) {
        command = 'C:\\Users\\Jooapa\\Documents\\GitHub\\Lighthouse\\backend\\build\\jseek.exe ' + query;
    } else {
        command = 'jseek ' + query;
    }

    // Kill existing jseek process if running
    if (currentJseekProcess) {
        currentJseekProcess.kill();
    }

    // Start new jseek process
    currentJseekProcess = spawn(command, { shell: true });
    currentJseekProcess.stdout.setEncoding('utf-8');
    currentJseekProcess.stderr.setEncoding('utf-8');

    return new Promise((resolve, reject) => {
        let result = '';
        let error = '';
        currentJseekProcess.stdout.on('data', (data) => {
            result += data;
        });

        currentJseekProcess.stderr.on('data', (data) => {
            error += data;
        });

        currentJseekProcess.on('close', (code) => {
            if (code === 0) {
                resolve(result);
            } else {
                reject(new Error(error));
            }
            // Clear the current process reference
            currentJseekProcess = null;
        });
    });
}

async function trySearch(query) {
    try {
        const result = await search(query);
        return result;
    } catch (error) {
        console.error(`Error occurred: '${error.message}' while searching for: '${query}'`);
        throw error;
    }
}

module.exports = {
    trySearch,
};
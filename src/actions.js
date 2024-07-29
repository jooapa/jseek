const { spawn } = require('child_process');

function search(query) {
    const command = 'C:\\Users\\Jooapa\\Documents\\GitHub\\Lighthouse\\backend\\build\\jseek.exe '+ query;
    
    const jseekRun = spawn(command, { shell: true });
    jseekRun.stdout.setEncoding('utf-8');
    jseekRun.stderr.setEncoding('utf-8');

    return new Promise((resolve, reject) => {
        let result = '';
        let error = '';
        jseekRun.stdout.on('data', (data) => {
            result += data;
        });

        jseekRun.stderr.on('data', (data) => {
            error += data;
        });

        jseekRun.on('close', (code) => {
            if (code === 0) {
                resolve(result);
            } else {
                reject(new Error(error));
            }
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
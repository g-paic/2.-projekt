const child_process = require('child_process');

const commands = [
    {
        name: 'App-1',
        command: 'cd ./ && start node web.js'
    },
    {
        name: 'App-2',
        command: 'cd ./ && start node evilWeb.js'
    }
];

function runCommand(command, name, callback) {
    child_process.exec(command, function(error, stdout, stderr) {
        if(stderr) {
            callback(stderr, null);
        } else {
            callback(null, `Successfully executed ${name} ...`);
        }
    });
}

function main() {
    commands.forEach(element => {
        runCommand(element.command, element.name, (err, res) => {
            if(err) {
                console.error(err);
            } else {
                console.log(res);
            }
        });
    });
}

main();
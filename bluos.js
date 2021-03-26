#!/bin/env node

const DEFAULT_IP = '192.168.1.242';
const PARSE_REGEX = /%([^%]+)%([^%]*)/g;

const main = async () => {
    const args = require('yargs')(process.argv)
        .command('play', 'Resume play')
        .command('pause', 'pause current song')
        .command('toggle', 'Toggle play state')
        .command('skip', 'Skip current song')
        .command('back', 'Back current song')
        .command('seek', 'Seek current song (requires extra argument)')
        .command('shuffle', 'Set shuffle state (requires extra argument)')
        .command('repeat', 'Set repeat state (requires extra argument)')
        .command('status', 'Get player status (requires etra argument)')
        .command('volume', 'Set player volume (requires etra argument)')
        .option('host', { description: 'The ip of the blueOS system', type: 'string', default: DEFAULT_IP })
        .option('polybar', { description: 'Echo [no-play-text] if not playing', type: 'boolean', default: false })
        .option('no-play-text', { description: 'Line to print if not currently playing and polybar is enabled.', type: 'string', default: ''})
        .alias('h', 'host')
        .demandCommand(3)
        .help()
        .argv;

    const command = args._[2];

    if (['seek', 'shuffle', 'repeat', 'status'].includes(command) && args._.length < 4) {
        console.log(`Command ${command} requires an extra argument`);
        return 1;
    }

    const blueosAPI = require('./bluosAPI')({
        ip: args.host
    });

    if (command === 'status') {
        const status = await blueosAPI.status();
        if (args.polybar && !status.playing) { console.log(args['no-play-text']); return 0; }

        let result = args._[3].split('%', 2)[0]; // Get head of the string.

        let parsed;
        while (parsed = PARSE_REGEX.exec(args._[3])) {
            const newVal = status[parsed[1]];
            if (newVal === undefined || parsed[1] === 'status') { console.log(`Attribute ${parsed[1]} unkown.`); return 1; }

            result += newVal + parsed[2]; // Insert parsed value and possible text behind.
        }


        console.log(result);
        return 0;
    }

    if (!blueosAPI.action[command]) {
        console.log(`Unknown command ${command}.`);
        return 1;
    }

    await blueosAPI.action[command](...args._.slice(3))
    return 0;
}

main().then((code) => {
    process.exit(code)
});

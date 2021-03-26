// Documentation: https://nadelectronics.com/wp-content/uploads/2020/12/Custom-Integration-API-v1.0_Dec_2020.pdf

class Status {
    constructor(status) {
        this.status = status;
    }

    get title() {
        return this.status.title1;
    }

    get album() {
        return this.status.album;
    }

    get artist() {
        return this.status.artist;
    }

    get playing() {
        return this.status.state !== 'pause' && this.status.status !== 'stop';
    }

    get volume() {
        return this.status.volume;
    }

    get muted() {
        return this.status.mute !== '0' || this.status.volume === 0;
    }

    get spotify() {
        return this.status.service === 'Spotify'
    }
}


const blueosAPI = ((config) => {
    const ip = config.ip;
    const port = config.port || 11000;

    const axios = require('axios').default;
    const parser = require('fast-xml-parser');
    const parserOptions = {
        ignoreAttributes: false
    };

    const parse = (data) => {
        return parser.parse(data, parserOptions, true)
    }

    const blueosAPI = axios.create({
        baseURL: `http://${ip}:${port}`,
        responseType: 'application/xml',
    });

    const volumeAPI = {
        get: async () => {
            const response = await blueosAPI.get('/Volume')
            return parse(response.data).volume['#text']
        },

    };

    return {
        status: async () => {
            const response = await blueosAPI.get('/Status');
            return new Status(parse(response.data).status);
        },

        action: {
            play: () => blueosAPI.get('/Play'),
            seek: (seconds) => blueosAPI.get(`/Play?seek=${seconds}`),
            pause: () => blueosAPI.get('/Pause'),
            toggle: () => blueosAPI.get('/Pause?toggle=1'),
            skip: () => blueosAPI.get('/Skip'),
            back: () => blueosAPI.get('/Back'),
            shuffle: (state) => blueosAPI.get(`/Shuffle?state${state}`), // state is bool if shuffle is on or not.
            repeat: (state) => blueosAPI.get(`/Repeat?state${state}`), // 0: Repeat queue. 1: Repeat track. 2: Do not repeat.
            volume: async (level) => { // Level is percentage of max volume.
                if (/^(\+|\-)/.test(level)) {
                    const curLevel = await volumeAPI.get();

                    level = curLevel + parseInt(level);
                }

                await blueosAPI.get(`/Volume?level=${level}`)
            }
        }
    }
});

module.exports = blueosAPI;

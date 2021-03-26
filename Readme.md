# BluOS API

A small hobby project implementing the [open source API][bluos] to communicate with BluOS devices. This is basically a Javascript binding which can be used by including `bluosAPI.js`. The file `bluos.js` is the CLI version of the API with the addition for polybar support, this means the value specified with the key `no-play-text` is printed if the BluOS player is not playing at that moment.

## Possible commands
The command is called same as in the [BluOS API documentation][bluos].

Help menu:
```
bluos.js <command>

Commands:
  bluos.js play     Resume play
  bluos.js pause    pause current song
  bluos.js toggle   Toggle play state
  bluos.js skip     Skip current song
  bluos.js back     Back current song
  bluos.js seek     Seek current song (requires extra argument)
  bluos.js shuffle  Set shuffle state (requires extra argument)
  bluos.js repeat   Set repeat state (requires extra argument)
  bluos.js status   Get player status (requires etra argument)
  bluos.js volume   Set player volume (requires etra argument)

Options:
      --version       Show version number                              [boolean]
      --polybar       Echo [no-play-text] if not playing
                                                      [boolean] [default: false]
      --no-play-text  Line to print if not currently playing and polybar is
                      enabled.                            [string] [default: ""]
      --help          Show help                                        [boolean]
  -h, --host          The ip of the blueOS system                       [string]
```

[bluos]: https://nadelectronics.com/wp-content/uploads/2020/12/Custom-Integration-API-v1.0_Dec_2020.pdf

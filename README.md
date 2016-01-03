Library for encoding/decoding MIDI patch dumps, currently supports:

* Roland Juno 106

Build it:

```shell
npm install
npm run test
npm run build
```

Use it:

```javascript
var RolandJuno106 = require('./lib').RolandJuno106;

// sysex can be either a Uint8Array or a Buffer
var patch = RolandJuno106.decode(sysex);

/*
    patch looks like this:
    { osc:
        { osc1:
          { lfo: 0,
            pwmLevel: 104,
            noise: 127,
            subOsc: 0,
            waveLength: '8',
            pulseWave: true,
            triangleWave: true,
            pwmType: 'manual' } },
        mod: { lfo: { rate: 127, delay: 0 } },
        filter:
        { frequency: 127,
          resonance: 0,
          envelopeAmount: 127,
          lfo: 127,
          keyboardTracking: 0,
          polarity: 'positive',
          hpf: 2 },
        envelope: { attack: 127, decay: 0, sustain: 0, release: 127 },
        amp: { level: 127, modType: 'gate' },
        chorus: { enabled: true, level: 1 } }
*/

// modify the patch
patch.filter.polarity = 'negative';

// re-encode it:
var modifiedSysex = RolandJuno106.encode(patch);

// don't be a moron!
```

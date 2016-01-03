let fs = require('fs');
import RolandJuno106 from '../../../src/roland_juno_106';

describe('RolandJuno106', () => {
  describe('sysex parsing', () => {
    it('returns a representation of patch state', () => {
      let sysexBuffer = fs
          .readFileSync('./test/fixtures/roland_juno_106/patch_dump.syx');

      let sysex = new Uint8Array(sysexBuffer);
      let expected =
          { osc:
            { osc1:
              { lfo: 0,
                pwmLevel: 79,
                noise: 0,
                subOsc: 127,
                waveLength: '4',
                pulseWave: true,
                triangleWave: true,
                pwmType: 'manual' } },
            mod: { lfo: { rate: 19, delay: 45 } },
            filter:
            { frequency: 127,
              resonance: 15,
              envelopeAmount: 17,
              lfo: 0,
              keyboardTracking: 29,
              polarity: 'negative',
              hpf: 2 },
            envelope: { attack: 0, decay: 60, sustain: 0, release: 127 },
            amp: { level: 105, modType: 'env' },
            chorus: { enabled: true, level: 2 } };

      let result = RolandJuno106.parse(sysex);
      expect(result).to.eql(expected);
    });
  });
});

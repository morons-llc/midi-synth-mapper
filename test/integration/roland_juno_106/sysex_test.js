let fs = require('fs');
import RolandJuno106 from '../../../src/roland_juno_106';

describe('RolandJuno106', function () {
  before(function () {
    this.sysexOneBuffer =
      fs.readFileSync('./test/fixtures/roland_juno_106/patch_dump_1.syx');
    this.sysexTwoBuffer =
      fs.readFileSync('./test/fixtures/roland_juno_106/patch_dump_2.syx');

    this.sysexTwoData =
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
          polarity: 'negative',
          hpf: 1 },
        envelope: { attack: 127, decay: 0, sustain: 0, release: 127 },
        amp: { level: 127, modType: 'gate' },
        chorus: { enabled: true, level: 1 } };
  });

  describe('sysex decoding', function () {
    it('returns a representation of patch state, input 1', function () {
      let sysex = new Uint8Array(this.sysexOneBuffer);
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
              hpf: 1 },
            envelope: { attack: 0, decay: 60, sustain: 0, release: 127 },
            amp: { level: 105, modType: 'env' },
            chorus: { enabled: true, level: 2 } };

      let result = RolandJuno106.sysexDecode(sysex);
      expect(result).to.eql(expected);
    });

    it('returns a representation of patch state, input 1', function () {
      let sysex = new Uint8Array(this.sysexTwoBuffer);
      let expected = this.sysexTwoData;
      let result = RolandJuno106.sysexDecode(sysex);

      expect(result).to.eql(expected);
    });
  });

  describe('sysex encoding', function () {
    it('encodes the patch state into sysex', function () {
      let expected = new Uint8Array(this.sysexTwoBuffer);
      let input = this.sysexTwoData;
      let result = RolandJuno106.sysexEncode(input);

      expect(result).to.eql(expected);
    });
  });

  describe('sysex encoding and decoding', function () {
    it('does not change the encoded message', function () {
      let expected = new Uint8Array(this.sysexTwoBuffer);
      let decoded = RolandJuno106.sysexDecode(expected);
      let result = RolandJuno106.sysexEncode(decoded);

      expect(result).to.eql(expected);
    });
  });
});

let fs = require('fs');
import RolandJuno106 from '../../../src/roland_juno_106';

function readSysexDumpFile(num) {
  return fs.readFileSync(`./test/fixtures/roland_juno_106/patch_dump_${num}.syx`);
}

describe('RolandJuno106', function () {
  describe('full patch encoding/decoding', function () {
    before(function () {
      this.sysexOneBuffer = readSysexDumpFile(1);
      this.sysexTwoBuffer = readSysexDumpFile(2);

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
            polarity: 'positive',
            hpf: 2 },
          envelope: { attack: 127, decay: 0, sustain: 0, release: 127 },
          amp: { level: 127, modType: 'gate' },
          chorus: { disabled: false, level: "II" } };
    });

    describe('full patch sysex decoding', function () {
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
                polarity: 'positive',
                hpf: 0 },
              envelope: { attack: 0, decay: 60, sustain: 0, release: 127 },
              amp: { level: 105, modType: 'env' },
              chorus: { disabled: false, level: "I" } };

        let result = RolandJuno106.decodeFullPatch(sysex);
        expect(result).to.eql(expected);
      });

      it('returns a representation of patch state, input 2', function () {
        let sysex = new Uint8Array(this.sysexTwoBuffer);
        let expected = this.sysexTwoData;
        let result = RolandJuno106.decodeFullPatch(sysex);

        expect(result).to.eql(expected);
      });
    });

    describe('full patch sysex encoding', function () {
      it('encodes the patch state into sysex', function () {
        let expected = new Uint8Array(this.sysexTwoBuffer);
        let input = this.sysexTwoData;
        let result = RolandJuno106.encodeFullPatch(input);

        expect(result).to.eql(expected);
      });
    });

    describe('sysex encoding and decoding', function () {
      it('does not change the encoded message', function () {
        let expected = new Uint8Array(this.sysexTwoBuffer);
        let decoded = RolandJuno106.decodeFullPatch(expected);
        let result = RolandJuno106.encodeFullPatch(decoded);

        expect(result).to.eql(expected);
      });
    });
  });

  describe('.paramChangeSupportedFor', function () {
    it('returns true if a param can be individually set', function () {
      let result = RolandJuno106.paramChangeSupportedFor("filter.resonance");
      expect(result).to.be.true;
    });

    it('returns false if a param cannot be individually set', function () {
      let result = RolandJuno106.paramChangeSupportedFor("filter.polarity");
      expect(result).to.be.false;
    });
  });

  describe('single param change encoding', function () {
    it('encodes LFO rate', function () {
      let result = RolandJuno106.encodeParamChange("mod.lfo.rate", 1);
      let expected = new Uint8Array([0xF0, 0x41, 0x32, 0x00, 0x00, 0x01, 0xF7]);

      expect(result).to.eql(expected);
    });

    it('encodes LFO delay', function () {
      let result = RolandJuno106.encodeParamChange("mod.lfo.delay", 1);
      let expected = new Uint8Array([0xF0, 0x41, 0x32, 0x00, 0x01, 0x01, 0xF7]);

      expect(result).to.eql(expected);
    });

    it('encodes DCO LFO modulation level', function () {
      let result = RolandJuno106.encodeParamChange("osc.osc1.lfo", 2);
      let expected = new Uint8Array([0xF0, 0x41, 0x32, 0x00, 0x02, 0x02, 0xF7]);

      expect(result).to.eql(expected);
    });

    it('encodes DCO PWM modulation level', function () {
      let result = RolandJuno106.encodeParamChange("osc.osc1.pwmLevel", 3);
      let expected = new Uint8Array([0xF0, 0x41, 0x32, 0x00, 0x03, 0x03, 0xF7]);

      expect(result).to.eql(expected);
    });

    it('encodes Noise level', function () {
      let result = RolandJuno106.encodeParamChange("osc.osc1.noise", 4);
      let expected = new Uint8Array([0xF0, 0x41, 0x32, 0x00, 0x04, 0x04, 0xF7]);

      expect(result).to.eql(expected);
    });

    it('encodes VCF cutoff level', function () {
      let result = RolandJuno106.encodeParamChange("filter.frequency", 5);
      let expected = new Uint8Array([0xF0, 0x41, 0x32, 0x00, 0x05, 0x05, 0xF7]);

      expect(result).to.eql(expected);
    });

    it('encodes VCF resonance level', function () {
      let result = RolandJuno106.encodeParamChange("filter.resonance", 6);
      let expected = new Uint8Array([0xF0, 0x41, 0x32, 0x00, 0x06, 0x06, 0xF7]);

      expect(result).to.eql(expected);
    });

    it('encodes VCF ENV level', function () {
      let result = RolandJuno106.encodeParamChange("filter.envelopeAmount", 7);
      let expected = new Uint8Array([0xF0, 0x41, 0x32, 0x00, 0x07, 0x07, 0xF7]);

      expect(result).to.eql(expected);
    });

    it('encodes VCF LFO modulation level', function () {
      let result = RolandJuno106.encodeParamChange("filter.lfo", 8);
      let expected = new Uint8Array([0xF0, 0x41, 0x32, 0x00, 0x08, 0x08, 0xF7]);

      expect(result).to.eql(expected);
    });

    it('encodes VCF KYBD modulation level', function () {
      let result = RolandJuno106.encodeParamChange("filter.keyboardTracking", 10);
      let expected = new Uint8Array([0xF0, 0x41, 0x32, 0x00, 0x09, 0x0A, 0xF7]);

      expect(result).to.eql(expected);
    });

    it('encodes VCA level', function () {
      let result = RolandJuno106.encodeParamChange("amp.level", 11);
      let expected = new Uint8Array([0xF0, 0x41, 0x32, 0x00, 0x0A, 0x0B, 0xF7]);

      expect(result).to.eql(expected);
    });

    it('encodes ENV attack rate', function () {
      let result = RolandJuno106.encodeParamChange("envelope.attack", 12);
      let expected = new Uint8Array([0xF0, 0x41, 0x32, 0x00, 0x0B, 0x0C, 0xF7]);

      expect(result).to.eql(expected);
    });

    it('encodes ENV decay rate', function () {
      let result = RolandJuno106.encodeParamChange("envelope.decay", 13);
      let expected = new Uint8Array([0xF0, 0x41, 0x32, 0x00, 0x0C, 0x0D, 0xF7]);

      expect(result).to.eql(expected);
    });

    it('encodes ENV sustain level', function () {
      let result = RolandJuno106.encodeParamChange("envelope.sustain", 14);
      let expected = new Uint8Array([0xF0, 0x41, 0x32, 0x00, 0x0D, 0x0E, 0xF7]);

      expect(result).to.eql(expected);
    });

    it('encodes ENV release rate', function () {
      let result = RolandJuno106.encodeParamChange("envelope.release", 15);
      let expected = new Uint8Array([0xF0, 0x41, 0x32, 0x00, 0x0E, 0x0F, 0xF7]);

      expect(result).to.eql(expected);
    });

    it('encodes Sub level', function () {
      let result = RolandJuno106.encodeParamChange("osc.osc1.subOsc", 16);
      let expected = new Uint8Array([0xF0, 0x41, 0x32, 0x00, 0x0F, 0x10, 0xF7]);

      expect(result).to.eql(expected);
    });
  });
});

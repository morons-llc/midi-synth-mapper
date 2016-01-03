export default {
  parse: function(sysex) {
    let constants = {
      WAVE_LENGTH_16: 1 << 0,
      WAVE_LENGTH_8: 1 << 1,
      WAVE_LENGTH_4: 1 << 2,
      PULSE_WAVEFORM_SET: 1 << 3,
      TRIANGLE_WAVEFORM_SET: 1 << 4,
      CHORUS_ON: 1 << 5,
      CHORUS_LEVEL: 1 << 6,
      DCO_PWM_TYPE: 1 << 0,
      VCA_MOD_TYPE: 1 << 1,
      VCF_POLARITY: 1 << 2
    };

    let patch = {
      "osc": { "osc1": {} },
      "mod": { "lfo": {} },
      "filter": {},
      "envelope": {},
      "amp": {},
      "chorus": {}
    };

    if (sysex[0] !== 0xf0) {
      throw "Bad sysex starter";
    }

    if (sysex[1] !== 0x41) {
      throw "NO ROLAND";
    }

    patch.mod.lfo.rate = sysex[5];
    patch.mod.lfo.delay = sysex[6];
    patch.osc.osc1.lfo = sysex[7];
    patch.osc.osc1.pwmLevel = sysex[8];
    patch.osc.osc1.noise = sysex[9];
    patch.filter.frequency = sysex[10];
    patch.filter.resonance = sysex[11];
    patch.filter.envelopeAmount = sysex[12];
    patch.filter.lfo = sysex[13];
    patch.filter.keyboardTracking = sysex[14];
    patch.amp.level = sysex[15];
    patch.envelope.attack = sysex[16];
    patch.envelope.decay = sysex[17];
    patch.envelope.sustain = sysex[18];
    patch.envelope.release = sysex[19];
    patch.osc.osc1.subOsc = sysex[20];

    if (sysex[21] & constants.WAVE_LENGTH_16) {
      patch.osc.osc1.waveLength = '16';
    } else if (sysex[21] & constants.WAVE_LENGTH_8) {
      patch.osc.osc1.waveLength = '8';
    } else if (sysex[21] & constants.WAVE_LENGTH_4) {
      patch.osc.osc1.waveLength = '4';
    } else {
      throw "The wavelength is not set?";
    }

    patch.osc.osc1.pulseWave =
      Boolean(sysex[21] & constants.PULSE_WAVEFORM_SET);
    patch.osc.osc1.triangleWave =
      Boolean(sysex[21] & constants.TRIANGLE_WAVEFORM_SET);
    patch.chorus.enabled = !Boolean(sysex[21] & constants.CHORUS_ON);
    patch.chorus.level = Boolean(sysex[21] & constants.CHORUS_LEVEL) ? 1 : 2;

    patch.osc.osc1.pwmType =
      Boolean(sysex[22] & constants.DCO_PWM_TYPE) ? 'manual' : 'lfo';
    patch.amp.modType =
      Boolean(sysex[22] & constants.VCA_MOD_TYPE) ? 'gate' : 'env';
    patch.filter.polarity =
      Boolean(sysex[22] & constants.VCF_POLARITY) ? 'positive' : 'negative';
    patch.filter.hpf = 3 - (sysex[22] & 3);

    return patch;
  }
};

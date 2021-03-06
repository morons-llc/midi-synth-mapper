import MIDIConstants from './constants';

let constants = {
  WAVE_LENGTH_16: 1 << 0,
  WAVE_LENGTH_8: 1 << 1,
  WAVE_LENGTH_4: 1 << 2,
  PULSE_WAVEFORM_SET: 1 << 3,
  TRIANGLE_WAVEFORM_SET: 1 << 4,
  CHORUS_OFF: 1 << 5,
  CHORUS_LEVEL: 1 << 6,
  DCO_PWM_TYPE: 1 << 0,
  VCA_MOD_TYPE: 1 << 1,
  VCF_POLARITY: 1 << 2,

  PARAM_CODES: { osc:
                 { osc1:
                   { lfo: 0x02,
                     pwmLevel: 0x03,
                     noise: 0x04,
                     subOsc: 0x0F,
                     waveLength: undefined,
                     pulseWave: undefined,
                     triangleWave: undefined,
                     pwmType: undefined } },
                 mod: { lfo: { rate: 0x00, delay: 0x01 } },
                 filter:
                 { frequency: 0x05,
                   resonance: 0x06,
                   envelopeAmount: 0x07,
                   lfo: 0x08,
                   keyboardTracking: 0x09,
                   polarity: undefined,
                   hpf: undefined },
                 envelope: { attack: 0x0B,
                             decay: 0x0C,
                             sustain: 0x0D,
                             release: 0x0E },
                 amp: { level: 0x0A, modType: undefined },
                 chorus: { disabled: undefined, level: undefined } }
};

// takes an instance of Buffer or Uint8Array
function decodeFullPatch(sysex) {
  sysex = new Uint8Array(sysex);

  let patch = {
    "osc": { "osc1": {} },
    "mod": { "lfo": {} },
    "filter": {},
    "envelope": {},
    "amp": {},
    "chorus": {}
  };

  if (sysex[0] !== 0xf0) {
    throw new Error("Bad sysex starter");
  }

  if (sysex[1] !== 0x41) {
    throw new Error("NO ROLAND");
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
    throw new Error("The wavelength is not set?");
  }

  patch.osc.osc1.pulseWave =
    Boolean(sysex[21] & constants.PULSE_WAVEFORM_SET);
  patch.osc.osc1.triangleWave =
    Boolean(sysex[21] & constants.TRIANGLE_WAVEFORM_SET);
  patch.chorus.disabled = Boolean(sysex[21] & constants.CHORUS_OFF);
  patch.chorus.level = Boolean(sysex[21] & constants.CHORUS_LEVEL) ? "II" : "I";

  patch.osc.osc1.pwmType =
    Boolean(sysex[22] & constants.DCO_PWM_TYPE) ? 'manual' : 'lfo';

  patch.amp.modType =
    Boolean(sysex[22] & constants.VCA_MOD_TYPE) ? 'gate' : 'env';
  patch.filter.polarity =
    Boolean(sysex[22] & constants.VCF_POLARITY) ? 'negative' : 'positive';

  patch.filter.hpf = 3 - ((sysex[22] >> 3) & 0b11);

  return patch;
}

function encodeFullPatch(patch) {
  let sysex = new Uint8Array(24);

  sysex[0] = MIDIConstants.messages.StartSysex;
  sysex[23] = MIDIConstants.messages.EndSysex;
  sysex[1] = MIDIConstants.manufacturers.roland;
  sysex[2] = 0x30; // message type
  sysex[4] = 37; // haha whynot

  sysex[5] = patch.mod.lfo.rate;
  sysex[6] = patch.mod.lfo.delay;
  sysex[7] = patch.osc.osc1.lfo;
  sysex[8] = patch.osc.osc1.pwmLevel;
  sysex[9] = patch.osc.osc1.noise;
  sysex[10] = patch.filter.frequency;
  sysex[11] = patch.filter.resonance;
  sysex[12] = patch.filter.envelopeAmount;
  sysex[13] = patch.filter.lfo;
  sysex[14] = patch.filter.keyboardTracking;
  sysex[15] = patch.amp.level;
  sysex[16] = patch.envelope.attack;
  sysex[17] = patch.envelope.decay;
  sysex[18] = patch.envelope.sustain;
  sysex[19] = patch.envelope.release;
  sysex[20] = patch.osc.osc1.subOsc;

  // ****************** byte 21

  switch (patch.osc.osc1.waveLength) {
    case '4':
      sysex[21] = constants.WAVE_LENGTH_4;
      break;
    case '8':
      sysex[21] = constants.WAVE_LENGTH_8;
      break;
    case '16':
      sysex[21] = constants.WAVE_LENGTH_16;
      break;
  }

  if (patch.osc.osc1.pulseWave) {
    sysex[21] = sysex[21] | constants.PULSE_WAVEFORM_SET;
  }

  if (patch.osc.osc1.triangleWave) {
    sysex[21] = sysex[21] | constants.TRIANGLE_WAVEFORM_SET;
  }

  if (patch.chorus.disabled) {
    sysex[21] = sysex[21] | constants.CHORUS_OFF;
  }

  if (patch.chorus.level === "II") {
    sysex[21] = sysex[21] | constants.CHORUS_LEVEL;
  }

  // ****************** byte 22

  if (patch.osc.osc1.pwmType === 'manual') {
    sysex[22] = sysex[22] | constants.DCO_PWM_TYPE;
  }

  if (patch.amp.modType === 'gate') {
    sysex[22] = sysex[22] | constants.VCA_MOD_TYPE;
  }

  if (patch.filter.polarity === 'negative') {
    sysex[22] = sysex[22] | constants.VCF_POLARITY;
  }

  sysex[22] = sysex[22] | ((3 - patch.filter.hpf) << 3);

  return sysex;
}

function _paramCodeFor(paramPath) {
  return paramPath
    .split(".")
    .reduce((memo, key) => memo[key],
            constants.PARAM_CODES);
}

function paramChangeSupportedFor(paramPath) {
  return !!_paramCodeFor(paramPath);
}

function encodeParamChange(paramPath, value, channel = 0) {
  let paramCode = _paramCodeFor(paramPath);

  if (value == null) {
    throw new Error(`No value provided for ${paramPath}`);
  }

  if (paramCode == null) {
    throw new Error(`No param code found for ${paramPath} with value ${value}`);
  }

  let sysex = new Uint8Array(7);

  sysex[0] = MIDIConstants.messages.StartSysex;
  sysex[1] = MIDIConstants.manufacturers.roland;
  sysex[2] = 0x32; // message type
  sysex[3] = channel; // MIDI channel
  sysex[4] = paramCode;
  sysex[5] = value;

  sysex[6] = MIDIConstants.messages.EndSysex;

  return sysex;
}

export default {
  decodeFullPatch,
  encodeFullPatch,
  encodeParamChange,
  paramChangeSupportedFor
};

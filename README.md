patch props example

```json
// juno 106
{
  "osc": {
    "Hard Sync": true,
    "osc1": { // DCO
      "LFO": slider([0,127]), // { range: [0, 127], value: null }
      "PWM": [0,127],
      "Sub Osc": [0,127],
      "Noise": [0,127]
    }
  },
  "mod": {
    "LFO": {
      "rate": [0,127],
      "delay": [0,127]
    }
  },
  "filter": {
    "VCF": {
      "Freq": [0,127],
      "Res": [0,127],
      "Env": [0,127],
      "LFO": [0,127],
      "KYBD": [0,127]
    }
  },
  "envelope" {
    "attack": [0,127],
    "delay": [0,127],
    "sustain": [0,127],
    "release": [0,127]
  },
  "VCA Level": [0,127]
}
```

function doit () {
  return new ;
}

() => {
  [
    this.filter.VCF.freq([0,127]),
  [
    this.pulse.on, // find single bit bool at schema.pulse.on
    this.tri, // find bool at schema.tri
    doit,
    this.pulse.width // find bool at schema.pulse.width
  ]
]

/*
  bit 0: some boolean
  bit 1-5: 4-bit integer
  bit 6: fuck you
  */

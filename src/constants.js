export default {
  messages: {
    NoteOff: 0x80,
    NoteOn: 0x90, // 144
    PolyAT: 0xA0, // 160
    CtrlChg: 0xB0, // 176
    ProgChg: 0xC0, // 192
    ChanPressure: 0xD0, // 208
    PitchBnd: 0xE0,
    StartSysex: 0xF0, // 240
    EndSysex: 0xF7, // 247
    TimeCode: 0xF1, // 241
    SongPos: 0xF2,
    SongSel: 0xF3,
    TuneReq: 0xF6
  },
  manufacturers: {
    roland: 0x41
  }
}

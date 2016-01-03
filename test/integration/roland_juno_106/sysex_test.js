let fs = require('fs');
import RolandJuno106 from '../../../src/roland_juno_106';

describe('RolandJuno106', () => {
  describe('sysex parsing', () => {
    it('returns a representation of patch state', () => {
      let sysexBuffer = fs
        .readFileSync('./test/fixtures/roland_juno_106/patch_dump.syx');

      let sysex = new Uint8Array(sysexBuffer);

      let result = RolandJuno106.parse(sysex);
      expect(result).to.eql({});
    });
  });
});

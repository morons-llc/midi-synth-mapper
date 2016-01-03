let fs = require('fs');
console.log(fs.readdirSync('./'));
let sysexBuffer = fs.readFileSync('./test/fixtures/roland_juno_106/patch_dump.syx');
let RolandJuno106 = require('./src/roland_juno_106');

describe('RolandJuno106', () => {
  describe('sysex parsing', () => {
    it('returns a representation of patch state', () => {
      let result = RolandJuno106.parse(sysexBuffer);
      expect(result).to.eq({});
    });
  });
});

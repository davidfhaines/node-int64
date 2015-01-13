describe('Int64', function () {
  it('testBufferToString', function () {
    var int = new Int64(0xfffaffff, 0xfffff700);
    expect(int.toBuffer().toString('hex')).toEqual('fffafffffffff700');    
  });

  it('testBufferCopy', function () {
    var src = new Int64(0xfffaffff, 0xfffff700);
    var dst = new ArrayBuffer(8);

    src.copy(dst);

    expect(dst).toEqual(new ArrayBuffer([0xff, 0xfa, 0xff, 0xff, 0xff, 0xff, 0xf7, 0x00]));   
  });

  it('testValueRepresentation', function () {
    var args = [
      [0],                     '0000000000000000', 0,
      [1],                     '0000000000000001', 1,
      [-1],                    'ffffffffffffffff', -1,
      [1e18],                  '0de0b6b3a7640000', 1e18,
      ['0001234500654321'],    '0001234500654321',     0x1234500654321,
      ['0ff1234500654321'],    '0ff1234500654321',   0xff1234500654300, // Imprecise!
      [0xff12345, 0x654321],   '0ff1234500654321',   0xff1234500654300, // Imprecise!
      [0xfffaffff, 0xfffff700],'fffafffffffff700',    -0x5000000000900,
      [0xafffffff, 0xfffff700],'affffffffffff700', -0x5000000000000800, // Imprecise!
      ['0x0000123450654321'],  '0000123450654321',      0x123450654321,
      ['0xFFFFFFFFFFFFFFFF'],  'ffffffffffffffff', -1
    ];

    // Test constructor argments

    for (var i = 0; i < args.length; i += 3) {
      var a = args[i], octets = args[i+1], number = args[i+2];

      // Create instance
      var x = new Int64();
      Int64.apply(x, a);

      expect(x.toOctetString()).toEqual(octets);
      expect(x.toNumber(true)).toEqual(number);
    }    
  });

  it('testBufferOffsets', function () {
    var sourceBuffer = new ArrayBuffer(16);
    sourceBuffer.writeUInt32BE(0xfffaffff, 2);
    sourceBuffer.writeUInt32BE(0xfffff700, 6);

    var int = new Int64(sourceBuffer, 2);
    expect(int.toBuffer().toString('hex')).toEqual('fffafffffffff700');

    var targetBuffer = new ArrayBuffer(16);
    int.copy(targetBuffer, 4);
    exoect(targetBuffer.slice(4, 12).toString('hex')).toEqual('fffafffffffff700');   
  });
});

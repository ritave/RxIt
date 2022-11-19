import * as rxit from '.';

describe('rxit', () => {
  it('should export from source', () => {
    expect(rxit.range).toBeDefined();
  });

  it('should export from transform', () => {
    expect(rxit.map).toBeDefined();
  });

  it('should export from sink', () => {
    expect(rxit.unwrap).toBeDefined();
  });
});

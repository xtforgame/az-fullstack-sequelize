function testCase() {
  describe('Basic', function () {
    this.timeout(20000);
    it('should able to use promise', () => Promise.resolve());
    it('should able to use promise', () => Promise.reject());
  });
}

export default testCase;

import { helloWorld } from '../example';

describe('Hello World', () => {
  it('should return hello world', () => {
    expect(helloWorld()).toBe('hello world');
  });
});

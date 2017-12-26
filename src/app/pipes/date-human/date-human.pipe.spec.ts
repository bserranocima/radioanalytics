import { DateHumanPipe } from './date-human.pipe';

describe('DateHumanPipe', () => {
  it('create an instance', () => {
    const pipe = new DateHumanPipe();
    expect(pipe).toBeTruthy();
  });
});

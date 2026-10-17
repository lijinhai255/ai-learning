import { LogMiddleware } from "./log.middleware.js";


describe('LogMiddleware', () => {
  it('should be defined', () => {
    expect(new LogMiddleware()).toBeDefined();
  });
});

'use strict';

const server = require('../../lib/server');
require('jest');

describe('server unit test', () => {
  beforeEach(server.start);
  afterAll(server.stop);

  it('shold return a promise rejection if the server is already running when started', () => {
    server.start()
      .catch(err => expect(err.message).toMatch(/Sever Error/i));
  });
});
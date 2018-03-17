'use strict';

const test = require('../../lib/error-handler');
require('jest');


describe('error-handler', function() {
  this.validation = new Error('Validation error: Cannot create note, subject or comment missing');
  this.res = { status: function(stat){this.statusCode = stat; return this; }, send: function(msg){this.message  = msg; return this;}};


  this.path_error = new Error('path error');
  this.fail = new Error('fail');
  this.objectId = new Error('objectid failed');
  this.duplicate = new Error('duplicate key');

  it('should respond with a status of 400', () => {
    let errRes = test(this.validation, this.res);
    expect(errRes.statusCode).toEqual(400);
  });
  it('should respond with a status of 404', () => {
    let errRes = test(this.path_error, this.res);
    expect(errRes.statusCode).toEqual(404);
  });
  it('should respond with a status of 500', () => {
    let errRes = test(this.fail, this.res);
    expect(errRes.statusCode).toEqual(500);
  });
  it('should respond with a status of 404', () => {
    let errRes = test(this.objectId, this.res);
    expect(errRes.statusCode).toEqual(404);
  });
  it('should respond with a status of 409', () => {
    let errRes = test(this.duplicate, this.res);
    expect(errRes.statusCode).toEqual(409);
  });
});
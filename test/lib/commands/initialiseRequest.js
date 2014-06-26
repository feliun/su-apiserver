'use strict';
var path = require('path');

var co = require('co');

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require("sinon-chai");

var rewire = require('rewire');

var RequestError = require('../../../lib/errors/RequestError');
var Base = require('super-base');

var fakes;
var underTest;
var next;
var ctxSuccess;
var ctxError;
var Request;

var modulePath = 'lib/commands/initialiseRequest';

chai.use(sinonChai);

describe(modulePath, function() {

  beforeEach(function() {

    underTest = rewire(path.resolve(modulePath));
    fakes = sinon.sandbox.create();
    next = function * () {};

    ctxSuccess = {
      request: {
        body: {}
      },
      params: {
        string: 'string',
        number: 10
      },
      header: {'x-csrf-token': '1234'}
    };

    ctxError = {
      request: {
        body: {}
      },
      params: {
        string: 10,
        number: 'string'
      },
      header: {'x-csrf-token': '1234'}
    };

    Request = Base.extend({

      hasOne: {

        value: {

          params: Base.extend({

            properties: {
              value: {
                string: {
                  type: 'string'
                },
                number: {
                  type: 'number'
                }
              }
            }
          })
        }
      }
    });

  });

  afterEach(function() {

    fakes.restore();
    underTest = null;
    next = null;
    ctxSuccess = null;
    ctxError = null;
    Request = null;

  });


  it('should attach a RequestError to the ctx if Request.init() errors', function (done) {

    co(function * () {

      yield underTest.call(ctxError, Request, next);

      expect(ctxError.e).to.be.instanceof(RequestError);

    })(done);

  });


  it('should register all the Request.init() errors with the RequestError', function (done) {

    co(function * () {

      yield underTest.call(ctxError, Request, next);

      expect(ctxError.e.errors.length).to.be.equal(2);

    })(done);

  });

  it('should attach the Request to the ctx', function (done) {

    co(function * () {

      yield underTest.call(ctxSuccess, Request, next);

      expect(Request.isPrototypeOf(ctxSuccess.r)).to.be.true;

    })(done);

  });


});

'use strict';
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");

var rewire = require('rewire');

var expect = chai.expect;

var CONF;
var fakes;
var apiDescriptor;
var api;
var requestDefinition;
var version;
var releaseName;
var apiName;
var apiUrl;
var apiApp;

chai.use(sinonChai);

describe('lib/start/apiDescriptor', function() {

  beforeEach(function() {

    CONF = rewire('config');
    apiDescriptor = rewire(process.cwd() + '/lib/start/apiDescriptor');
    fakes = sinon.sandbox.create();
    version = 'v1';
    releaseName = 'stable';

    apiName = 'apiName';
    apiUrl = 'apiUrl';

    api = {
      method: 'GET',
      type: 'json'
    };

    requestDefinition = {
      params: 10,
      query: 20
    }

    apiApp = {};
  });

  afterEach(function() {

    fakes.restore();

  });

  describe('initialiseVersion', function () {

    it('should create a new array to hold the version descriptor', function() {

      apiDescriptor.initialiseVersion(version);

      expect(apiDescriptor.versions.v1).to.be.instanceof(Array);

    });

    it('should do nothing if the version has alreay been set', function() {

      apiDescriptor.initialiseVersion(version);

      var v = apiDescriptor.versions.v1;

      apiDescriptor.initialiseVersion(version);

      expect(v).to.be.equal(apiDescriptor.versions.v1);

    });



  });


  describe('create', function () {

    it('should push a data structure representing an API on the correct version array', function() {

      apiDescriptor.initialiseVersion(releaseName);
      apiDescriptor.create(apiName, api, apiUrl, version, releaseName, requestDefinition, apiApp);

      var v = apiDescriptor.versions[releaseName][0];

      expect(v.id).to.be.equal(apiName);
      expect(v.method).to.be.equal(api.method);
      expect(v.type).to.be.equal(api.type);
      expect(v.url).to.be.equal(CONF.apis.base + '/' + releaseName + apiUrl);
      expect(v.params).to.be.equal(requestDefinition.params);
      expect(v.query).to.be.equal(requestDefinition.query);
      expect(v.version).to.be.equal(version);
      expect(v.release).to.be.equal(releaseName);
    });

    it('should throw an error if the supplied version does not exist', function() {

      expect(function () {

        apiDescriptor.create(apiName, api, apiUrl, version, requestDefinition);

      }).to.throw(RangeError);

    });

  });


});

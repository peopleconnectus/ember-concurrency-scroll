'use strict';

const expect = require('chai').expect;
const denodeify = require('denodeify');
const request = denodeify(require('request'));
const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;

describe('Acceptance | Application', function() {
  this.timeout(720000);

  let app;

  before(function() {
    app = new AddonTestApp();

    return app.create('dummy', {
      fixturesPath: 'tests'
    }).then(() => {
      return app.run('npm', 'install');
    });
  });

  beforeEach(function() {
    return app.startServer();
  });

  afterEach(function() {
    return app.stopServer();
  });

  it('doesn\'t break the build', function() {
    return request('http://localhost:49741/assets/vendor.js')
      .then(response => {
      expect(response.body).to.contain('ember-concurrency-scroll');
    });
  });
});

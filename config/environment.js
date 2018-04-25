'use strict';

module.exports = function(environment, appConfig) {
  let testingOverrides = {};
  if (environment === 'test' && !process.env.CONCURRENCY_SCROLL_TEST) {
    testingOverrides.duration = 1;
  }
  return {
    'ember-concurrency-scroll': {
      overrides: Object.assign(
        {},
        testingOverrides,
        (appConfig['ember-concurrency-scroll'] || {}).overrides || {}
      )
    }
  };
};

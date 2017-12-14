/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-concurrency-scroll',
  included() {
    this._super.included.apply(this, arguments);
    this.import('node_modules/easing/index.js', {
      using: [
        { transformation: 'cjs', as: 'easing'}
      ]
    });
  }
};

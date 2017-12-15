/* eslint-env node */
'use strict';

module.exports = {
  description: 'defaultBlueprint for ember-concurrency-scroll',
  normalizeEntityName() {}, // no-op since we're just adding dependencies

  afterInstall() {
    let pkg = require('../../package.json');

    // Add addons to package.json and run defaultBlueprint
    return this.addAddonsToProject({
      // a packages array defines the addons to install
      packages: [
        // name is the addon name, and target (optional) is the version
        {name: 'ember-cli-cjs-transform', target: pkg.peerDependencies['ember-cli-cjs-transform']}
      ]
    });
  }
};

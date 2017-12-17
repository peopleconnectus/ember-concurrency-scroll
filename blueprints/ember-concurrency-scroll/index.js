/* eslint-env node */
'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
  description: 'defaultBlueprint for ember-concurrency-scroll',
  normalizeEntityName() {}, // no-op since we're just adding dependencies

  afterInstall() {
    let pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));

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

/* eslint-env node */
module.exports = {
  description: 'defaultBlueprint for ember-concurrency-scroll',
  normalizeEntityName() {}, // no-op since we're just adding dependencies

  afterInstall() {
    // Add addons to package.json and run defaultBlueprint
    return this.addAddonsToProject({
      // a packages array defines the addons to install
      packages: [
        // name is the addon name, and target (optional) is the version
        {name: 'ember-cli-cjs-transform'},
        {name: 'ember-concurrency'}
      ]
    });
  }
};

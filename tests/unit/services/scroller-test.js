import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

let scrollToSpy = sinon.spy(window, "scrollTo");
let service;
moduleFor('service:scroller', 'Unit | Service | scroller', {
  beforeEach() {
    service = this.subject();
    scrollToSpy.reset();
  },
  afterEach() {
    service = null;
  }
});

// Replace this with your real tests.
test('it exists', function(assert) {
  assert.ok(service);
});

test('scrollTo calls window.scrollTo', async function(assert) {
  await service.get('scrollTo').perform(0, 1000);
  // default duration of 1000ms should have 100 steps
  assert.equal(scrollToSpy.callCount, 100);
  assert.deepEqual(scrollToSpy.firstCall.args, [0, 0]);
  assert.deepEqual(scrollToSpy.lastCall.args, [0, 1000]);
});

test('scrollTo takes object args', async function(assert) {
  await service.get('scrollTo').perform({x: 0, y: 0}, {x: 0, y: 1000});

  assert.deepEqual(scrollToSpy.firstCall.args, [0, 0]);
  assert.deepEqual(scrollToSpy.lastCall.args, [0, 1000]);
});

test('scrollTo does scroll x axis if already in viewport', async function(assert) {
  await service.get('scrollTo').perform({x: 0, y: 0}, {x: 100, y: 1000});

  assert.deepEqual(scrollToSpy.firstCall.args, [0, 0]);
  // x axis should not change
  assert.deepEqual(scrollToSpy.lastCall.args, [100, 1000]);
});

test('scrollTo does not scroll x axis with ignoreViewport', async function(assert) {
  await service.get('scrollTo').perform({x: 0, y: 0}, {x: 100, y: 1000}, { ignoreViewport: false });

  assert.deepEqual(scrollToSpy.firstCall.args, [0, 0]);
  // x axis should not change
  assert.deepEqual(scrollToSpy.lastCall.args, [0, 1000]);
});

test('scrollTo handles xy scrolling', async function(assert) {
  await service.get('scrollTo').perform({x: 0, y: 0}, {x: 5000, y: 5000});

  assert.deepEqual(scrollToSpy.firstCall.args, [0, 0]);
  assert.deepEqual(scrollToSpy.lastCall.args, [5000, 5000]);
});

test('scrollTo handles negative xy scrolling', async function(assert) {
  await service.get('scrollTo').perform({x: 5000, y: 5000}, {x: 0, y: 0});

  assert.deepEqual(scrollToSpy.firstCall.args, [5000, 5000]);
  assert.deepEqual(scrollToSpy.lastCall.args, [0, 0])
});

// test('scrollToElementId finds element')

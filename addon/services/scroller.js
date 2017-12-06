import Service from '@ember/service';
import { assert } from '@ember/debug';
import Easing from 'easing';
import { task, timeout } from 'ember-concurrency';

const easeTypes = ['linear', 'quadratic', 'cubic', 'quartic', 'quintic', 'sinusoidal', 'sin', 'circular', 'exponential'];

export default Service.extend({
  scrollToElementId: task(function * (elementId, options = {}) {
    let start = this.getDocumentTop();
    let end = document && document.getElementById(elementId).offsetTop;
    // if we're targeting a container, account for offset to start and end
    if (options.container) {
      let container = this.getContainer(options.container);
      start = container.scrollTop;
      end = end - container.offsetTop;
    }
    yield this.get('scrollToX').perform(start, end, options);
  }),

  scrollToElement: task(function * (element, options = {}) {
    let start = this.getDocumentTop();
    let end = element.offsetTop;
    // if we're targeting a container, account for offset to start and end
    if (options.container) {
      let container = this.getContainer(options.container);
      start = container.scrollTop;
      end = end - container.offsetTop;
    }
    yield this.get('scrollToX').perform(start, end, options);
  }),

  // start position, end position, duration in ms, easetype
  scrollToX: task(function * (start, end, options = {}) {
    console.log('scrollto ', start, end)
    let easeType = options.type || 'sinusoidal';
    let duration = options.duration || 1000;
    let container = options.container && this.getContainer(options.container) || window;
    let scrollTo = this.getScrollTo(container);
    assert(`"${options.type}" is not a valid easeType. It must be one of these options: ${easeTypes}`, easeTypes.indexOf(easeType) !== -1);
    let index = 0,
      delay = duration * 0.001,
      steps = Math.ceil(duration * 0.1),
      target = end - start,
      eases = Easing(steps, easeType);
    while (index < steps) {
      scrollTo(0, ( eases[index] * target ) + start);
      index++;
      yield timeout(delay);
    }
  }).keepLatest(),

  cancelAll() {
    this.get('scrollToX').cancelAll();
  },

  getScrollTo(container) {
    if (container === window) {
      return container.scrollTo;
    } else {
      return (y, x) => {
        container.scrollTop = x;
      };
    }
  },

  getContainer(container) {
    if (typeof container !== 'string') {
      return container;
    } else {
      // assume the string is an element id
      return document && document.getElementById(container);
    }
  },

  getDocumentTop() {
    assert('document is not available', document);
    return document && document.documentElement.scrollTop || document && document.body.scrollTop || 0;
  }
});

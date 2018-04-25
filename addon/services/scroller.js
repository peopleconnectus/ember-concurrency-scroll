import Service from '@ember/service';
import { assert } from '@ember/debug';
import Easing from 'easing';
import { task, timeout } from 'ember-concurrency';
import config from 'ember-get-config';
import window from 'ember-window-mock';
import { assign } from '@ember/polyfills';

const easeTypes = ['linear', 'quadratic', 'cubic', 'quartic', 'quintic', 'sinusoidal', 'sin', 'circular', 'exponential'];

export default Service.extend({
  init() {
    this._super(...arguments);
    let conf = config['ember-concurrency-scroll'];
    let padding = typeof conf.padding === 'undefined' ? 20 : conf.padding;
    let ignoreViewport = typeof conf.ignoreViewport === 'undefined' ? true : conf.ignoreViewport;
    let defaults = {
      axis: conf.axis || 'y',
      duration: conf.duration || 1000,
      easeType: conf.easeType || 'sinusoidal',
      ignoreViewport,
      padding: {
        x: padding && padding.x || padding,
        y: padding && padding.y || padding
      }
    };
    this.set('defaults', defaults);
    this.set('overrides', conf.overrides);
  },

  // scroll to an element by id
  scrollToElementId() {
    return this.get('scrollToElementIdTask').perform(...arguments);
  },

  // task version so you can use the perform helper
  scrollToElementIdTask: task(function * (elementId, options = {}) {
    let element = document && document.getElementById(elementId);
    assert(`An element with the id: '${elementId}' could not be found in the DOM. Be sure to check that it has been rendered before attempting to scroll to it.`, element);
    yield this.get('scrollToElementTask').perform(element, options);
  }),

  // scroll to an element
  scrollToElement() {
    return this.get('scrollToElementTask').perform(...arguments);
  },

  // task version so you can use the perform helper
  scrollToElementTask: task(function * (element, options = {}) {
    let start = {
      y: this.getDocumentScrollTop(),
      x: this.getDocumentScrollLeft()
    };
    let end = {
      y: element.offsetTop,
      x: element.offsetLeft
    };
    // if we're targeting a container, account for offset to start and end
    if (options.container) {
      let container = this.getContainer(options.container);
      start.y = container.scrollTop;
      end.y = end.y - container.offsetTop;
      start.x = container.scrollLeft;
      end.x = end.x - container.offsetLeft;
    }
    yield this.get('scrollToTask').perform(start, end, options);
  }),

  // scroll to a position
  scrollTo() {
    return this.get('scrollToTask').perform(...arguments);
  },

  // start position, end position, duration in ms, easetype
  scrollToTask: task(function * (start, end, options = {}) {
    options = assign({}, this.get('defaults'), options, this.get('overrides'));
    let axis = options.axis;
    let ignoreViewport = options.ignoreViewport;
    let container = options.container && this.getContainer(options.container) || window;
    let easeType = options.easeType;
    let duration = options.duration;
    let scrollTo = this.getScrollTo(container);
    let viewportHeight = container.innerHeight || container.clientHeight || document.documentElement.clientHeight;
    let viewportWidth = container.innerWidth || container.clientWidth || document.documentElement.clientWidth;
    let startX, startY, endX, endY, paddingX,  paddingY;
    if (options.padding) {
      assert('The padding option must have x and y properties', typeof options.padding.x !== 'undefined' && typeof options.padding.y !== 'undefined');
      paddingX = options.padding.x;
      paddingY = options.padding.y;
    }
    if (typeof start === 'object') {
      assert('The start argument must have x and y properties', typeof start.x !== 'undefined' && typeof start.y !== 'undefined');
      assert('The end argument must have x and y properties', typeof end.x !== 'undefined' && typeof end.y !== 'undefined');
      startX = start.x;
      startY = start.y;
      endX = end.x;
      endY = end.y;
      // if the end is within the viewport, we don't need to scroll that axis
      if (!ignoreViewport && start.x <= end.x && end.x <= viewportWidth) {
        axis = 'y';
      } else if (!ignoreViewport && start.y <= end.y && end.y <= viewportHeight) {
        axis = 'x';
      } else {
        axis = 'xy';
      }
    } else if (axis === 'y') {
      startY = start;
      endY = end;
      startX = endX = container.scrollLeft || container.scrollX;
    } else {
      startX = start;
      endX = end;
      startY = endY = container.scrollTop || container.scrollY;
    }
    assert(`"${options.type}" is not a valid easeType. It must be one of these options: ${easeTypes}`, easeTypes.indexOf(easeType) !== -1);
    // x and y easing variables
    let index = 0,
      delay = duration * 0.001,
      steps = Math.ceil(duration * 0.1),
      targetY = endY - startY - paddingY,
      targetX = endX - startX - paddingX,
      offsetY = startY,
      offsetX = startX,
      dirY = 1,
      dirX = 1,
      eases = Easing(steps, easeType);

    if (startY > endY) {
      targetY = startY - endY + paddingY;
      dirY = -1;
    }

    if (startX > endX) {
      targetX = startX - endX + paddingX;
      dirX = -1;
    }
    // Ember.Logger.log(start, end, `tx:${targetX}, ty:${targetY}, ox:${offsetX}, oy:${offsetY}, ${axis}`)
    while (index < steps) {
      if (axis === 'x') {
        // scroll x axis
        scrollTo(eases[index] * targetX * dirX + offsetX, startY);
      } else if (axis === 'xy' || axis === 'both') {
        // scroll x and y axis
        scrollTo(eases[index] * targetX * dirX  + offsetX,  eases[index] * targetY * dirY + offsetY);
      } else {
        // scroll y axis
        scrollTo(startX,  eases[index] * targetY * dirY + offsetY);
      }
      index++;
      yield timeout(delay);
    }
  }).keepLatest(),

  cancelAll() {
    this.get('scrollTo').cancelAll();
  },

  getScrollTo(container) {
    // if scrollTo is a function, it's most likely the window
    if (typeof container.scrollTo === 'function') {
      return container.scrollTo;
    // otherwise it's an element
    } else {
      return (x, y) => {
        container.scrollLeft = x;
        container.scrollTop = y;
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

  getDocumentScrollTop() {
    assert('document is not available', document);
    return document && document.documentElement.scrollTop || document && document.body.scrollTop || 0;
  },

  getDocumentScrollLeft() {
    assert('document is not available', document);
    return document && document.documentElement.scrollLeft || document && document.body.scrollLeft || 0;
  }
});

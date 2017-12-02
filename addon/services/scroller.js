import Service from '@ember/service';
import { assert } from '@ember/debug';
import Easing from 'easing';
import { task, timeout } from 'ember-concurrency';

const easeTypes = ['linear', 'quadratic', 'cubic', 'quartic', 'quintic', 'sinusoidal', 'sin', 'circular', 'exponential'];
export default Service.extend({
  scrollToElementId: task(function * (elementId, duration, type) {
    let start = document.documentElement.scrollTop || document.body.scrollTop;
    let end = document.getElementById(elementId).offsetTop;
    yield this.get('scrollToX').perform(start, end, duration, type);
  }),

  scrollToElement: task(function * (element, duration, type) {
    let start = document.documentElement.scrollTop || document.body.scrollTop;
    let end = element.offsetTop;
    yield this.get('scrollToX').perform(start, end, duration, type);
  }),

  // start position, end position, duration in ms, easetype
  scrollToX: task(function * (start, end, duration, type) {
    let easeType = type || 'sinusoidal';
    assert(`"${type}" is not a valid easeType. It must be one of these options: ${easeTypes}`, easeTypes.indexOf(easeType) != -1);
    let index = 0,
      delay = duration * 0.001,
      steps = Math.ceil(duration * 0.1),
      target = end - start,
      eases = Easing(steps, easeType);
    while (index < steps) {
      window.scrollTo(0, ( eases[index] * target ) + start);
      index++;
      yield timeout(delay);
    }
    this.get('scrollToX').cancelAll();
  }).drop()
});

import Service from '@ember/service';
// import { quadOut } from 'eases';
import { task, timeout } from 'ember-concurrency';

export default Service.extend({
  // scrollToElement

  scrollToX: task(function * (start, end, speed) {

    let isTarget = false,
      step = (end - start) / speed,
      pos = start,
      dir = start > end ? -1 : 1,
      delay = speed * dir * 0.1;

    while (!isTarget) {
      pos += step;
      window.scrollTo(0, pos);
      if (dir > 0 && pos >= end || dir < 0 && pos <= end) {
        isTarget = true;
        console.log('HIT TARGET!')
      }
      yield timeout(delay);
    }
    this.get('scrollToX').cancelAll();
  })
});

//window.scrollTo(0, document.getElementById('2').offsetTop)

import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
export default Component.extend({
  tagName: 'button',
  scroller: service(),
  scroll: task(function *() {
    yield this.get('scroller.scrollToElementId').perform(...arguments);
    if (this.get('bounce')){
      yield this.get('scroller.scrollToElementId').perform('1');
    }
  }),
  click() {
    this.get('scroll').perform(this.get('target'), {
      duration: 1500,
      easeType: 'sin'
    });
    let cancel = ()=> {
      // console.log('cancel!', this.get('scroller.scrollTo.state'));
      if (this.get('scroller.scrollTo.isRunning')) {
        // this.get('scroller.scrollToElementId').perform('1');
      }
    };
    // this.$(document.body).one('click', cancel);
  }
})

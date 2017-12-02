import Component from '@ember/component';
import { inject as service } from '@ember/service';
export default Component.extend({
  tagName: 'button',
  scroller: service(),
  click() {
    this.get('scroller.scrollToElementId').perform(this.get('target'), 1500, 'sin');
  }
})

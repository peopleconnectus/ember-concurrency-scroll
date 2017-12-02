import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
export default Component.extend({
  tag: 'button',
  name: 'button',
  scroller: service(),
  start: computed(function() {
    return this.get('element').offsetTop;
  }),
  end: computed('target', function(){
    return this.get('target').offsetTop;
  }),
  click() {
    this.get('scroller.scrollToX').perform(this.get('start'), this.get('end'), 1000);
  }
})

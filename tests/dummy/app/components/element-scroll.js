import Component from '@ember/component';
let { compute } = '@ember/object';
import { inject as service } from '@ember/service';
export default Component.extend({
  tag: 'button',
  name: 'button',
  scroller: service(),
  start: compute(function() {
    return this.get('element').offsetTop;
  }),
  end: compute('target', function(){
    return this.get('target').offsetTop;
  }),
  click() {
    this.get('scroller.scrollToX').perform(this.get('start'), this.get('end'), 1000);
  }
})

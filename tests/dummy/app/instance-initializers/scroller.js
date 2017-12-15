export function initialize(appInstance) {
  appInstance.inject('controller', 'scroller', 'service:scroller');
}

export default {
  name: 'scroller',
  initialize
};

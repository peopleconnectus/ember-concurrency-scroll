# ember-concurrency-scroll

This addon provides a `scroller` service that leverages `ember-concurrency` tasks to manage window and element scrolling. By using `ember-concurrency`, you can perform a scroll task, then chain a follow up task or action afterwards. This can be very useful in situations where you need to scroll to an element that needs the user's attention, by scrolling first, then calling the user's attention with some sort of behavior like a modal or popover.

The other benefit to using `ember-concurrency` is that the scrolling task can be cancelled at any point, either by calling another scroll task, or explicitly cancelling it with cancelAll.
## Features
`ember-concurrency-scroll` offers three scrolling tasks via the `scroller service`:
### `scroller.scrollToElementId(id, options)`
  Primary use, allows you to scroll to a specific element by its `id` attribute.

### `scroller.scrollToElement(element, options)`
Allows you to scroll to an element by passing the element itself. Useful for components to scroll to themselves if they're out of the viewport.

### `scroller.scrollTo(start, end, options)`
Core task, handles actual scrolling via easing, calling `window.scrollTo` or setting the value via `element.scrollTop` and `element.scrollLeft`. Start and end values can be either numeric (when we only want to scroll in one axis), OR they can be coordinate objects containing an x and y value ({x:0, y:0}).

#### Options
##### duration _integer_
Scroll duration in milliseconds. Default is `1000`.

##### padding _number_/_object_
Adds an offset to the number of pixels above and to the left of the target element when scrolling. Can either be a number (used for both `x` and `y` values), or an object containing `x` and `y` values. Useful if you want to scroll using `scrollToElement`, but don't want to scroll to the exact position of the element. Can also be a negative value, to scroll past the target element position. Default is `20`.

##### easeType _string_
Easing type used in scroll. Default is `sinusoidal`.

Easing options are available (via the [`node-easing` library](https://github.com/rook2pawn/node-easing)), but the default is a sinusoidal ease. The available easing types are:

* `cubic`
* `circular`
* `exponential`
* `linear`
* `quartic`
* `quadratic`
* `quintic`
* `sinusoidal` (default)

The number of ease steps are calculated using the scroll duration value (default is 1000ms), which results in an array of predefined easing steps used for the scrolling.

##### axis _string_
Determines the axis to scroll on, when the `start` and `end` values are numeric. Default is 'y'.

##### ignoreViewport _boolean_
Determines if the scrollTo task should scroll if the target position is already in the viewport. Default is `true`.

##### container _string_/_element_
A DOM element or id to target for scrolling. Allows you to scroll the contents of fixed size elements with overflow property set to scroll. See the example below for further explanation.

## Usage
```js
// example element-scroll component
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
export default Component.extend({
  tagName: 'button',
  scroller: service(),
  scroll: task(function *() {
    // It is recommended to wrap the scroller service task in component task to allow for cleanup if the component is destroyed mid task
    yield this.get('scroller.scrollToElementId').perform(...arguments);
  }),
  click() {
    this.get('scroll').perform(this.get('target'), {
      duration: 1500,
      easeType: 'linear',
      // padding determines the how far above or to the left of the target element to scroll to, so we don't scroll to the exact edge of the element
      padding: {
        x: 100,
        y: 100
      }
    });
  }
});

// implementing the component
{{#element-scroll target="title"}}scroll to title{{/element-scroll}}
```
You can limit the scroll to a specific element, for instance, if you had a fixed size container that you wanted to scroll to a specific element inside that container, you'd pass either the container id or the element as the `container` option. Note that if you do use the container option, it will only scroll inside the container, and the window will not scroll to the container element itself. You could solve this by first scrolling to the container, then scrolling to the element inside the container with the container option.
```js
  scrollToContentsTitle : task(function *() {
    yield this.get('scroller.scrollToElementId').perform('contents');
    yield this.get('scroller.scrollToElementId').perform('title', {container: 'contents'});
  })
```
## Config
The scroller defaults can be set in `config/environment.js`, allowing you to set the defaults for your entire app, rather than having to override every time you use the scroller.

```js
// config/environment.js
/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'dummy',
    ...
    // add your defaults at the root level of the config
    'ember-concurrency-scroll': {
      duration: 1400,
      easeType: 'linear',
      padding: {
        x: 0,
        y: 0
      }
    }
  }
```

## Installation

* `git clone <repository-url>` this repository
* `cd ember-concurrency-scroll`
* `npm install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

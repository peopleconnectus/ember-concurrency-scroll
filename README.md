# concurrency-scroll

This addon provides a `scroller` service that leverages `ember-concurrency` tasks to manage window and element scrolling. By using `ember-concurrency`, you can perform a scroll task, then chain a follow up task or action afterwards. This can be very useful in situations where you need to scroll to an element that needs the user's attention, by scrolling first, then calling the user's attention with some sort of behavior like a modal or popover.

The other benefit to using `ember-concurrency` is that the scrolling task can be cancelled at any point, either by calling another scroll task, or explictly cancelling it with cancelAll.
## Installation

* `git clone <repository-url>` this repository
* `cd concurrency-scroll`
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

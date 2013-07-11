# FancyArea

Is it just a textarea? No. It's much fancier than that. A FancyArea is a great way to handle a user-entered list of items.

## Featuring:

- Immediate feedback when the user enters an item
- Validation before items are added
- Deleting and editing of existing items
- Simple integration with Twitter's [typeahead.js](http://twitter.github.io/typeahead.js/) (as well as [bootstrap-typeahead](http://twitter.github.io/bootstrap/javascript.html#typeahead))
- Custom events when an item is added, removed, or changed

## Getting Started

### How do I make one?

It's easy! As long as you're using jQuery 1.7 or newer, just throw a `textarea` on your page, and hit it with this Javascript:

```
$('textarea').fancyArea();
```

Suddenly, your boring `textarea` is transformed into a slick FancyArea.

### How do I style it?

Your new FancyArea is actually a `div` styled to look like a `textarea`. By default, it has a class of `fancy-area` (and `fancy-area-focus` when the input is focused), but you can change these classes when you initialize your FancyArea.

FancyArea will also absorb the ID and any classes that applied to the original `textarea`.

You'll probably want to give a `width` (or `min-width`) to FancyArea unless you want a full-width text box. Unlike the original `textarea`, the browser won't limit the width of your FancyArea by default.

### How do I find the contents of my FancyArea?

When the content is changed, several custom jQuery events are triggered. You can listen to these events and use the data supplied to the callback function.

Immediately after creating a FancyArea, you can chain an event listener like this:

```
$('textarea').fancyArea().on('fancyItemChanged', function (event, items) {
  // the `items` argument contains an array of all items as strings
});
```

Two other custom events, `fancyItemAdded` and `fancyItemRemoved`, also pass data to the callback function.

If you don't want to keep track of the data with Javascript, it's all stored in `input` elements, so it will be submitted to the server when the form is submitted.

### How can I validate the input?

When invoking a FancyArea, you can pass a custom validation function. This function will be run before an item is added or changed. If the function returns false, the item will not be added. The default validation function does not allow empty strings to be added. The following would only allow items that start with "m":

```
$('textarea').fancyArea({
  validate: function (text) {
    return text.indexOf('m') === 0;
  }
});
```

### How do I add typeahead suggestions?

The `demo.html` file is a great place to start. When the FancyArea plugin creates an `input`, a custom event is triggered on the `document` and a jQuery object representing the input is passed to the callback function.  Using typeahead.js, you can initialize typeahead functionality like this:

```
$(document).on('fancyInputCreated', function (event, $input) {
  $input.typeahead();
});
```

Because typeahead.js doesn't allow you to clear the `input` by simply setting `.val('')`, you'll need to manually empty the query each time FancyArea adds an item:

```
$('textarea').fancyArea().on('fancyItemAdded', function () {
  $('.fancy-text-entry').typeahead('setQuery', '');
});
```

Again, a more detailed example is available in the `demo.html` file.

## How is it licensed?

MIT-style. Like this:

> Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

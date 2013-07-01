/*! FancyArea */
// Copyright 2013 Michael Martin-Smucker
// Released under the MIT License

(function ($, window) {
    "use strict";

    // make sure document is correct
    var document = window.document,
        $areas = $();

    $.fn.fancyArea = function () {
        this.each(function () {
            var $this = $(this),
                $area = $('<div />'),
                $list = $('<ul />').appendTo($area),
                $entry = $('<input class="fancy-text-entry" />').appendTo($area),
                items = [];

            function getCurrentItems() {
                var strItems = [],
                    i;

                for (i = 0; i < items.length; i += 1) {
                    strItems[i] = items[i].text;
                }

                return strItems;
            }

            function addItem(text) {
                var $li = $('<li class="fancy-item"></li>').appendTo($list),
                    $item = $('<input value="' + text + '" />').appendTo($li),
                    $remove = $('<span class="fancy-remove">&times;</span>').appendTo($li),
                    index = items.length;

                $remove.on('click', function (e) {
                    e.stopPropagation();
                    removeItem(index);
                    $entry.focus();
                });

                $item.on('keyup', function (e) {
                    if (e.which !== 13) { return; }

                    // re-focus the original entry after editing is done
                    $entry.focus();
                }).on('blur', function () {
                    var val = $item.val();

                    // if the value didn't change, return
                    if (items[index].text === val) { return; }

                    // otherwise, update the array with the latest data,
                    // and trigger the change function
                    items[index].text = val;
                    $area.trigger('fancyItemChanged', [getCurrentItems()]);
                });

                items.push({
                    $li: $li,
                    text: text,
                    index: index
                });
                $area.trigger('fancyItemChanged', [getCurrentItems()]).trigger('fancyItemAdded', [text]);
            }

            function removeItem(index) {
                var current = items[index],
                    text; // = current.text;

                // remove the list item from the page
                current.$li.remove();

                // remove the index from the items array
                items.splice(index, 1);

                // trigger the change and remove events with updated data
                $area.trigger('fancyItemChanged', [getCurrentItems()]).trigger('fancyItemRemoved', [text]);
            }

            // absorb classes from the existing textarea that is being replaced
            $area.addClass('fancy-area ' + $this[0].className);

            // simulate a 'blur' event when focus leaves the div/input
            $(document).on('click', function (e) {
                var $target = $(e.target),
                    focusClass = 'fancy-area-focus';

                if ($area.is($target)) {
                    // if $area was clicked, add the focus class and focus the input
                    $area.addClass(focusClass);
                    $entry.focus();
                } else if ($area.has($target).length) {
                    // if one of $area's descendants was clicked, only add the focus class
                    // using .has() here seems to be faster than the alternatives
                    // prooflink: http://jsperf.com/jquery-has-vs-is-el-find
                    $area.addClass(focusClass);
                } else {
                    // otherwise, remove the focus class
                    $area.removeClass(focusClass);
                }
            });

            // pressing "Enter" in the input should add the item to the `ul`
            $entry.on('keyup', function (e) {
                var text;

                if (e.which === 13) {
                    // add an item if the "Enter" key was pressed
                    text =  $entry.val();
                    addItem(text);
                    $entry.val('');
                }
            }).on('keydown', function (e) {
                var lastIndex = items.length - 1;

                if (e.which === 8 && $entry.val() === '') {
                    // if backspace is pressed and the input is empty
                    // re-edit the previous item
                    $entry.val(items[lastIndex].text);
                    removeItem(lastIndex);
                    return false;
                }
            });

            $this.replaceWith($area);
            $areas = $areas.add($area);
        });

        return $areas;
    };
}(jQuery, window));

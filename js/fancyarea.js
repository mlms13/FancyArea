/*! FancyArea */
// Copyright 2013 Michael Martin-Smucker
// Released under the MIT License

(function ($, window) {
    "use strict";

    // make sure document is correct
    var document = window.document,
        $areas = $();

    $.fn.fancyArea = function (options) {
        this.each(function () {
            var $this = $(this),
                $area = $('<div />'),
                $list = $('<ul />').appendTo($area),
                $entry = $('<input class="fancy-text-entry" />').appendTo($area),
                items = [],
                settings = $.extend({
                    validate: function (text) {
                        return text !== '';
                    }
                }, options);

            // trigger a global event so that typeahead can bind to the input
            $(document).trigger('fancyInputCreated', [$entry]);

            function getCurrentItems() {
                var strItems = [],
                    i;

                for (i = 0; i < items.length; i += 1) {
                    strItems[i] = items[i].text;
                }

                return strItems;
            }

            function addItem(text) {
                var item = {
                    $li: $('<li class="fancy-item"></li>'),
                    $input: $('<input />').attr('value', text),
                    $remove: $('<span class="fancy-remove">&times;</span>'),
                    text: text,
                    index: items.length
                };

                $(document).trigger('fancyInputCreated', [item.$input]);

                item.$remove.on('click', function (e) {
                    e.stopPropagation();
                    removeItem(item.index);
                    $entry.focus();
                });

                item.$input.on('keyup', function (e) {
                    if (e.which !== 13) { return; }

                    // re-focus the original entry after editing is done
                    $entry.focus();
                })
                .on('focus', function () {
                    item.$li.addClass('fancy-item-focus');
                })
                .on('blur', function () {
                    var val = item.$input.val();

                    item.$li.removeClass('fancy-item-focus');

                    // re-focus the input if validation fails
                    if (!settings.validate(val)) {
                        item.$input.focus();
                        return;
                    }

                    // if the value didn't change, return
                    if (items[item.index].text === val) { return; }

                    // otherwise, update the array with the latest data,
                    // and trigger the change function
                    items[item.index].text = val;
                    $area.trigger('fancyItemChanged', [getCurrentItems()]);
                });

                // piece the elements together
                item.$li.append(item.$input, item.$remove).appendTo($list);

                // add item to the array
                items.push(item);

                $area.trigger('fancyItemChanged', [getCurrentItems()]).trigger('fancyItemAdded', [item]);
            }

            function removeItem(index) {
                var current = items[index],
                    text = current.text,
                    i;

                // remove the list item from the page
                current.$li.remove();

                // remove the index from the items array
                items.splice(index, 1);

                // loop through all following items, updating each index
                for (i = index; i < items.length; i += 1) {
                    items[i].index -= 1;
                }

                // trigger the change and remove events with updated data
                $area.trigger('fancyItemChanged', [getCurrentItems()]).trigger('fancyItemRemoved', [{
                    'index': index,
                    'text': text
                }]);
            }

            // absorb classes from the existing textarea that is being replaced
            $area.addClass('fancy-area ' + $this[0].className)
            .attr('id', $this[0].id);

            // any label that used to target the textarea should now focus $entry
            $('[for=' + $this[0].id + ']').on('click', function() {
                $entry.focus();
            });

            // when any input in FancyArea loses focus,
            // simulate a blur on the FancyArea div
            $area.on('blur', 'input', function () {
                $area.removeClass('fancy-area-focus');
            });

            // but, if the focus just moved to a different input in FancyArea
            // re-add the focus class
            $area.on('focus', 'input', function () {
                $area.addClass('fancy-area-focus');
            });

            // when the FancyArea is clicked, move focus to the main input
            $area.on('click', function () {
                $entry.focus();
            });

            // and when one of the FancyArea's children is clicked
            // prevent the click from bubbling up to $area,
            // which would force $entry to be focused
            $area.children().on('click', function (e) {
                e.stopPropagation();
            });

            // pressing "Enter" in the input should add the item to the `ul`
            $entry.on('keyup', function (e) {
                var text = $entry.val();

                if (e.which === 13 && settings.validate(text)) {
                    // add an item if the "Enter" key was pressed
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

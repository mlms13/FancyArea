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

            function addItem(text) {
                var $li = $('<li class="fancy-item"></li>').appendTo($list),
                    $item = $('<input value="' + text + '" />').appendTo($li),
                    $remove = $('<span class="fancy-remove">&times;</span>').appendTo($li);

                $remove.on('click', function (e) {
                    e.stopPropagation();
                    $li.remove();
                    $area.trigger('fancyItemChanged', [items]).trigger('fancyItemRemoved', [text]);
                    $entry.focus();
                });

                $item.on('keyup', function (e) {
                    if (e.which !== 13) { return; }

                    // re-focus the original entry after editing is done
                    $entry.focus();
                }).on('blur', function () {
                    var $this = $(this),
                        index = $this.parent().index();

                    // if the value didn't change, return
                    if (items[index] === $this.val()) { return; }

                    // otherwise, update the array with the latest data,
                    // and trigger the change function
                    items[index] = $this.val();
                    $area.trigger('fancyItemChanged', [items]);
                });

                items.push(text);
                $area.trigger('fancyItemChanged', [items]).trigger('fancyItemAdded', [text]);
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
                var $prev;

                if (e.which === 8 && $entry.val() === '') {
                    // if backspace is pressed and the input is empty
                    // re-edit the previous item
                    $prev = $area.find('li:last');
                    $entry.val($prev.find('input').val());
                    $prev.find('.fancy-remove').click();
                    return false;
                }
            });

            $this.replaceWith($area);
            $areas = $areas.add($area);
        });

        return $areas;
    };
}(jQuery, window));

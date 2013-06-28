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
                $entry = $('<input class="fancy-text-entry" />').appendTo($area);

            function addItem(text) {
                var $li = $('<li class="fancy-item"></li>').appendTo($list),
                    $item = $('<input value="' + text + '" />').appendTo($li),
                    $remove = $('<span class="fancy-remove">&times;</span>').appendTo($li);

                $remove.on('click', function (e) {
                    e.stopPropagation();
                    $li.remove();
                    $area.trigger('fancyItemRemoved', [text]);
                    $entry.focus();
                });

                $item.on('keyup', function (e) {
                    if (e.which !== 13) { return; }
                    $entry.focus();
                });

                $area.trigger('fancyItemAdded', [text]);
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

                // only act if the "Enter" key was pressed
                if (e.which !== 13) { return; }

                text = $entry.val();

                // add a new item and clear the input
                addItem(text);
                $entry.val('');
            });

            $this.replaceWith($area);
            $areas = $areas.add($area);
        });

        return $areas;
    };
}(jQuery, window));

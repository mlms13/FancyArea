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
                $ul = $('<ul />').appendTo($area),
                $input = $('<input class="fancy-text-entry" />').appendTo($area);

            function addItem(text) {
                var $li = $('<li class="fancy-item">' + text + '</li>').appendTo($ul),
                    $remove = $('<span class="fancy-remove">&times;</span>').appendTo($li);

                $remove.on('click', function () {
                    $li.remove();
                    $area.trigger('fancyItemRemoved', [text]);
                });

                $area.trigger('fancyItemAdded', [text]);
            }

            // absorb classes from the existing textarea that is being replaced
            $area.addClass('fancy-area ' + $this[0].className);

            // clicking on the FancyArea div should focus the input
            $area.on('click', function () {
                $area.addClass('fancy-area-focus');
                $input.focus();
            });

            // simulate a 'blur' event when focus leaves the div/input
            $(document).on('click', function (e) {
                var $target = $(e.target);

                // if $area or one of its descendants was clicked, return and do nothing
                // using .has() here seems to be faster than the alternatives
                // prooflink: http://jsperf.com/jquery-has-vs-is-el-find
                if ($area.is($target) || $area.has($target).length) { return; }

                // otherwise, remove the *-focus class
                $area.removeClass('fancy-area-focus');
            });

            // pressing "Enter" in the input should add the item to the `ul`
            $input.on('keyup', function (e) {
                var text;

                // only act if the "Enter" key was pressed
                if (e.which !== 13) { return; }

                text = $input.val();

                // add a new item and clear the input
                addItem(text);
                $input.val('');
            });

            $this.replaceWith($area);
            $areas = $areas.add($area);
        });

        return $areas;
    };
}(jQuery, window));

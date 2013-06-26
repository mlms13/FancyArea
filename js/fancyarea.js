/*! FancyArea */
// Copyright 2013 Michael Martin-Smucker
// Released under the MIT License

!function ($) {
    "use strict";

    $.fn.fancyArea = function () {
        return this.each(function () {
            var $this = $(this),
                $area = $('<div />'),
                $ul = $('<ul />').appendTo($area),
                $input = $('<input />').appendTo($area);

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
                if ($area.is($target) || $area.has($target).length) return;

                // otherwise, remove the *-focus class
                $area.removeClass('fancy-area-focus');
            });

            $this.replaceWith($area);
        });
    };
}(jQuery);

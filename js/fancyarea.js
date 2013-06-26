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
            $this.replaceWith($area);
        });
    };
}(jQuery);

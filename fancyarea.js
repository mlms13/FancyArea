/*! FancyArea */
// Copyright 2013 Michael Martin-Smucker
// Released under the MIT License

!function ($) {
    "use strict";

    $.fn.fancyArea = function () {
        return this.each(function () {
            var $area = $('<div class="fancy-area" />'),
                $ul = $('<ul />').appendTo($area),
                $input = $('<input />').appendTo($area);

            $(this).replaceWith($area);
        });
    };
}(jQuery);

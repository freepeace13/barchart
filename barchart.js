(function ($, window, document) {
    var $container,
        defaults = {
            data: [],
            className: "barchart",
            minHeight: 100,
            balloonSize: {
                width: 300,
                height: 280
            },
            singleChart: false,
            bordered: true
        };

    function Chart(element, options) {
        this.element = $(element);
        this.options = $.extend({}, defaults, options);

        this.init();
    }

    Chart.prototype.init = function() {
        var self = this;

        if (!self.options.data.length) return;

        $container = $("<div>").attr({
            class: this.options.className
        });

        if (!this.options.singleChart) {
            $container.css("flex-wrap", "wrap");
        } else {
            $container.append(
                $("<h5>").attr({class: "right label"}).html(self.options.data.last().day)
            ).append(
                $("<h5>").attr({class: "left label"}).html(self.options.data.first().day)
            );
        }

        this.element.append($container);
        this.createBar();
    };

    Chart.prototype.countProviders = function(data) {
        var count = 0;
        $.each(data, function(index, item) {
            count += item.provider.length;
        });
        return count;
    };

    Chart.prototype.createBar = function() {
        var self = this;

        $.each(self.options.data, function(groupIndex, group) {
            var groupCopy = group,
                group = $.extend(true, {}, group);

            delete group['day'];
            delete group['footerFunction'];

            var groupContainer = $("<div>").attr({
                style: `flex:${self.countProviders(group)};display:flex;min-height:${self.options.minHeight}px;`,
                class: "group-container"
            });

            if (!self.options.singleChart) {
                groupContainer.css("min-width", "100%").css("margin-bottom", "110px");
                groupContainer.append(
                    $("<h5>").attr({class: "left label"}).html(groupCopy.day)
                );
            }
            $.each(group, function (piecesIndex, pieces) {
                var bgColor = self.color();
                var piecesContainer = self.createPiecesContainer(bgColor, pieces.provider.length);

                console.log(pieces.provider);

                $.each(pieces.provider, function (elementIndex, element) {
                    piecesContainer.append(self.createElement(element, bgColor));
                });

                groupContainer.append(piecesContainer);
            });

            if (typeof groupCopy.footerFunction === 'function' && !self.options.singleChart) {
                groupContainer.append(
                    $("<div>").attr({
                        class: "footer-container"
                    }).html(
                        groupCopy.footerFunction(groupCopy)
                    )
                );
            }

            $container.append(groupContainer);
        });
    };

    Chart.prototype.createElement = function(element, borderColor) {
        return $("<div>").attr({
            style: `${(this.options.bordered) ? "border:1px solid #fff;" : "" }flex:auto;`,
            class: "elements"
        }).html(
            $('<div>').attr({
                class: "balloon-container",
                style: `border:3px solid ${borderColor};top:-${this.options.balloonSize.height - (this.options.minHeight / 2)}px;height:${this.options.balloonSize.height}px;width:${this.options.balloonSize.width}px;`
            }).html(
                this.options.balloonFunction(element)
            )
        );
    }

    Chart.prototype.createPiecesContainer = function(bgColor, size) {
        return $("<div>").attr({
            style: "background:" + bgColor + ";flex:" + size + ";display:flex",
            class: "pieces-container"
        })
    };

    Chart.prototype.color = function() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    $.fn.barchart = function (options) {
        return this.each(function () {
            new Chart(this, options);
        });
    };
})(jQuery, window, document);
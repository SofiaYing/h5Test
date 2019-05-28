(function() {
    FX.plugins["animate"] = (function(id, option) {

        var Animate = function(id, option) {
            this.$target = $("#" + id);
            this.init(id, option);
        };

        // 继承接口
        FX.utils.inherit(FXInterface, Animate);

        (function($) {
            $.fn.extend({
                animateCss: function(animationName) {
                    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                    $(this).addClass('animated ' + animationName).one(animationEnd, function() {
                        $(this).removeClass('animated ' + animationName);
                    });
                }
            });
        })(jQuery);

        //组件初始化
        Animate.prototype.init = function(id, option) {
            var animationNodes = $("div[title='Animation']")

            var firstAniId = animationNodes.attr("id");
            if (firstAniId !== id)
                return;

            // 监听视窗
            var intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach((item) => {
                    if (item.isIntersecting) {
                        var inputNode = $(item.target).parent().children('input')
                            // var value = eval('(' + inputNode[0].value + ')')
                            // $(item.target).addClass('animated ' + value.states[0].animations[0].effect)
                        var value = animationDataProcess(inputNode)
                        console.log('inputValue', value)
                            // value.animations.effect
                        $(item.target).animateCss('animated ' + 'fadeIn')
                        $(item.target).css({ "animatiton-duration": value.animations.playTime + 's', "-webkit-animation-duration": value.animations.playTime + 's' })
                    }
                })
            });

            $(animationNodes).children('div').each(function(index, item) {
                intersectionObserver.observe(item)
            })

        };

        //重置数据
        Animate.prototype.reset = function(option) {

        };

        //数据重置
        Animate.prototype.destroy = function() {

        };

        function animationDataProcess(node) {
            var valueObject = {};
            var valueTemp = eval('(' + node[0].value + ')')
            valueObject.animations = valueTemp.states[0].animations[0]
                // direction: "bottom"
                // effect: "fall"
                // playDelay: "0"
                // playTime: "4"
                // type: "toAppearance-0"
                // uid: "0-0"
            return valueObject
        }

        return new Animate(id, option);
    });
})();
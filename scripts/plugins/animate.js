(function() {
    FX.plugins["animate"] = (function(id, option) {

        var Animate = function(id, option) {
            this.$target = $("#" + id);
            this.init(id, option);
        };

        // 继承接口
        FX.utils.inherit(FXInterface, Animate);

        // if (!window.IntersectionObserver) {
        // var s = document.createElement('script');
        // s.src = 'https://polyfill.io/v2/polyfill.min.js?features=IntersectionObserver';
        // s.async = true;
        // document.head.appendChild(s);
        // }

        //组件初始化
        Animate.prototype.init = function(id, option) {
            var animationNodes = $("div[title='Animation']")

            var firstAniId = animationNodes.attr("id");
            if (firstAniId !== id)
                return;

            $(animationNodes).each(function(index, item) {
                var dataInput = $(item).children('input')
                var animationDiv = $(item).children('div')
                var valueTemp = eval('(' + dataInput[0].value + ')')
                var animations = valueTemp.states[0].animations

                $.each(animations, function(index, item) {
                    var autoAnimationCount = 0
                    var clickAnimationCount = 0
                    if (item.type.charAt(item.type.length - 1) === '0' && autoAnimationCount === 0) {
                        //载入页面动画 绑定视窗监听事件
                        intersectionObserverAutoAnimation.observe(animationDiv[0])
                        autoAnimationCount += 1
                    } else if (item.type.charAt(item.type.length - 1) === '1' && clickAnimationCount === 0) {
                        //单击动画 绑定单击事件
                        $(animationDiv[0]).on('click', function() {
                            $(this).addClass('animated fadeOut ' + 'delay-' + item.playDelay + 's')
                        })
                        intersectionObserverClickAnimation.observe(animationDiv[0])
                        clickAnimationCount += 1
                    }
                })
            })

        };

        //重置数据
        Animate.prototype.reset = function() {

        };

        //数据重置
        Animate.prototype.destroy = function() {

        };

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

        // 监听视窗：进入可视窗口单击可触发动画
        var intersectionObserverClickAnimation = new IntersectionObserver((entries) => {
            entries.forEach((item) => {
                if (!item.isIntersecting) {
                    var inputNode = $(item.target).parent().children('input')
                    var value = animationDataProcess(inputNode)
                    $(item.target).removeClass('animated fadeOut') // value.animations.effect
                }
            })
        });



        // 监听视窗:进入可视窗口自动触发动画
        var intersectionObserverAutoAnimation = new IntersectionObserver((entries) => {
            entries.forEach((item) => {
                console.log(item)
                if (item.isIntersecting) {
                    var inputNode = $(item.target).parent().children('input')
                    var value = animationDataProcess(inputNode)
                    console.log('inputValue', value)
                    $(item.target).css({ "animatiton-duration": value.animations.playTime + 's', "-webkit-animation-duration": value.animations.playTime + 's' })
                        // $(item.target).addClass('animated slideInUp ' + 'delay-' + value.animations.playDelay + 's')
                    $(item.target).animateCss('animated fadeIn ' + 'delay-' + value.animations.playDelay + 's')

                } else {
                    $(item.target).removeClass('animated fadeIn')
                }
            })
        });

        function animationDataProcess(node) {
            var valueObject = {};
            var valueTemp = eval('(' + node[0].value + ')')
            var animations = valueTemp.states[0].animations
            $.each(animations, function(index, item) {
                    valueObject.animations = item
                })
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
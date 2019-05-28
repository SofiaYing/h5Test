(function() {
    FX.plugins["animate"] = (function(id, option) {

        var Animate = function(id, option) {
            this.$target = $("#" + id);
            this.init(id, option);
        };

        // 继承接口
        FX.utils.inherit(FXInterface, Animate);

        //组件初始化
        Animate.prototype.init = function(id, option) {
            var animationNodes = $("div[title='Animation']")

            var firstAniId = animationNodes.attr("id");
            if (firstAniId !== id)
                return;

            // 监听视窗
            // var intersectionObserver = new IntersectionObserver((entries) => {
            //     entries.forEach((item) => {
            //         if (item.isIntersecting) {
            //             var inputNode = $(item.target).parent().children('input')

            //             var value = animationDataProcess(inputNode)
            //             console.log('inputValue', value)
            //                 // value.animations.effect
            //                 // $(item.target).animateCss('animated ' + 'fadeIn')
            //             $(item.target).addClass('animated fadeIn ' + 'delay-' + value.animations.playDelay + 's')
            //                 // $(item.target).animateCss('animated ' + 'fadeIn ' + 'delay-' + value.animations.playDelay + 's')
            //             $(item.target).css({ "animatiton-duration": value.animations.playTime + 's', "-webkit-animation-duration": value.animations.playTime + 's' })
            //         } else {
            //             $(item.target).removeClass('animated fadeIn')
            //         }
            //     })
            // });



            // $(animationNodes).children('div').each(function(index, item) {
            //     intersectionObserver.observe(item)
            // })

            $(animationNodes).each(function(index, item) {
                var dataInput = $(item).children('input')
                var animationDiv = $(item).children('div')
                var valueTemp = eval('(' + dataInput[0].value + ')')
                var animations = valueTemp.states[0].animations

                $.each(animations, function(index, item) {
                    console.log('1111', item)
                    if (item.type.charAt(item.type.length - 1) === '0') {
                        // valueObject.autoAnimations = item
                        intersectionObserver.observe(animationDiv[0])
                    } else if (item.type.charAt(item.type.length - 1) === '1') {
                        // valueObject.clickAnimations = item
                        console.log('animationDiv[0]', animationDiv[0])
                        console.log($('div[title="Animation"]>div'))
                        $('body').on('click', 'div[title="Animation"]>div', () => {
                            console.log('e', this)
                                // event.preventDefault();

                            $(this).addClass('animated fadeOut ' + 'delay-' + item.playDelay + 's')
                                // $(documet).on('click', animationDiv[0], function() {
                                //     alert($(this).html());
                                // })
                        })

                    }
                })
            })

        };

        //重置数据
        Animate.prototype.reset = function(option) {

        };

        //数据重置
        Animate.prototype.destroy = function() {

        };

        //驱动animate.css
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

        // 监听视窗
        var intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((item) => {
                if (item.isIntersecting) {
                    var inputNode = $(item.target).parent().children('input')

                    var value = animationDataProcess(inputNode)
                    console.log('inputValue', value)
                        // value.animations.effect
                        // $(item.target).animateCss('animated ' + 'fadeIn')
                        // $(item.target).addClass('animated fadeIn ' + 'delay-' + value.autoAnimations.playDelay + 's')
                        // $(item.target).animateCss('animated ' + 'fadeIn ' + 'delay-' + value.autoAnimations.playDelay + 's')
                    $(item.target).parent().animateCss('animated ' + 'slideInUp ' + 'delay-' + value.autoAnimations.playDelay + 's')
                    $(item.target).css({ "animatiton-duration": value.autoAnimations.playTime + 's', "-webkit-animation-duration": value.autoAnimations.playTime + 's' })
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
                    console.log('1111', item)
                    if (item.type.charAt(item.type.length - 1) === '0') {
                        valueObject.autoAnimations = item
                    } else if (item.type.charAt(item.type.length - 1) === '1') {
                        valueObject.clickAnimations = item
                    }
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
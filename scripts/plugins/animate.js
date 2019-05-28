(function() {
    FX.plugins["animate"] = (function(id, option) {

        var timePlus = 1000;
        var animation_list = [];

        var waitTime = 0;
        var lasti = -1,
            lastj = -1;
        // var lastType;
        var firstAnimationDelay = 0; //网页加载动画延迟时间,防止移动设备硬件问题造成第一个动画无法看到
        var nLastSynWithFirstAni = -1; //上一个与网页加载动画同步的动画
        var nFirstNonPageLoadAni = -1; //第一个非网页加载动画
        // var ismobile = is_mobile();
        var stopId; //动画播放setTimeout的停止Id
        // 对象
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
            // each Animate
            // var page = this.$target.parents(".swiper-slide");
            // var aniInPage = page.find("div[title='Animation']");
            var animationNodes = $("div[title='Animation']")
                // var firstAniInPage = aniInPage.eq(0);
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
                    }
                })
            });

            $(animationNodes).children('div').each(function(index, item) {
                intersectionObserver.observe(item)
            })



            // animationNodes.each(function() {
            //     var client = $(this);
            //     var winW = client.width();
            //     var winH = client.height();
            //     if (!is_mobile()) client.css("transform", "translateZ(0px)");
            //     var idx_Animation = 0;
            //     var iLenth = client.children().length;
            //     for (var idx = 0; idx < iLenth; idx++) {
            //         var jsonnode = client.children()[idx];

            //         if (jsonnode.nodeName.toLowerCase() === 'input') {
            //             var demoAnimation = client.children()[idx_Animation];
            //             var itemTop = parseInt(demoAnimation.style.top);
            //             var itemLeft = parseInt(demoAnimation.style.left);
            //             var spaceW = $(demoAnimation).width();
            //             var spaceH = $(demoAnimation).height();

            //             if ($(demoAnimation).is(":animated")) $(demoAnimation).stop(true, true);
            //             if (!$(demoAnimation).data("itemTop")) $(demoAnimation).data("itemTop", itemTop);
            //             if (!$(demoAnimation).data("itemLeft")) $(demoAnimation).data("itemLeft", itemLeft);
            //             if (!$(demoAnimation).data("spaceW")) $(demoAnimation).data("spaceW", spaceW);
            //             if (!$(demoAnimation).data("spaceH")) $(demoAnimation).data("spaceH", spaceH);
            //             // no json
            //             console.log(jsonnode)
            //             var jsonStr = jsonnode.value;
            //             var data = eval('(' + jsonStr + ')');
            //             console.log('data', data)
            //             for (var i = idx_Animation; i < (idx_Animation + data.states.length); i++) {
            //                 var demo = client.children().eq(i);
            //                 var ctPopup = demo.parents("div[title='PopupContent']").length;
            //                 var iUid;
            //                 for (var j = 0; j < data.states[i - idx_Animation].animations.length; j++) {
            //                     //飞翔动画样张,第三页,[进入,滑动;退出,回弹]
            //                     var uid = data.states[i - idx_Animation].animations[j].uid;
            //                     var triggerEvent = data.states[i - idx_Animation].animations[j].type.charAt(data.states[i - idx_Animation].animations[j].type.length - 1);
            //                     var Adata = {
            //                         'Demo': demo,
            //                         'winW': winW,
            //                         'winH': winH,
            //                         'itemTop': itemTop,
            //                         'itemLeft': itemLeft,
            //                         'spaceW': spaceW,
            //                         'spaceH': spaceH,
            //                         'animate': data.states[i - idx_Animation].animations[j],
            //                         'triggerEvent': triggerEvent,
            //                         'ctPopup': ctPopup
            //                     };
            //                     // if (Adata.animate.type.indexOf("toAppearance") !== -1) demo.css("opacity", 0);
            //                     iUid = parseInt(uid);
            //                     if (j === 0 && animation_list[iUid] === undefined) {
            //                         animation_list[iUid] = [];
            //                     } else if (j === 0 && animation_list[iUid] !== undefined) {} else if (j > 0 && triggerEvent === '1') { //单击
            //                         iUid = parseInt(data.states[i - idx_Animation].animations[0].uid);
            //                     } else if (j > 0 && triggerEvent === '0') {
            //                         // 飞翔动画样张,第三页,[进入,滑动;退出,回弹]
            //                         // 如果该元素上的第一个动画是载入页面时加载,第二个动画也是载入页面时加载,忽略第二个动画
            //                         var iUid0 = parseInt(data.states[i - idx_Animation].animations[0].uid);
            //                         if (animation_list[iUid0][0].triggerEvent === "0") {
            //                             iUid = iUid0;
            //                         }
            //                         // 动画7.9.pdml
            //                         else if (animation_list[iUid] === undefined) {
            //                             animation_list[iUid] = [];
            //                         }
            //                     } else if (j > 0 && triggerEvent !== '0' && triggerEvent !== '1' && animation_list[iUid] === undefined) {
            //                         animation_list[iUid] = [];
            //                     } else if (j > 0 && triggerEvent !== '0' && triggerEvent !== '1' && animation_list[iUid] !== undefined) {}
            //                     animation_list[iUid].push(Adata);
            //                 }
            //             }
            //             idx_Animation = idx + 1;
            //         }
            //     }


            //     //自定义方法
            //     $.fn.displayAnimate = function() {
            //         var winW = $(this).width();
            //         var winH = $(this).height();
            //         var len = $(this).children().length;
            //         //在hide前记录原来坐标，防止丢失
            //         var szOrgLeft = [];
            //         var szOrgTop = [];
            //         for (var i = 0; i < len; i += 2) {
            //             var divItem = $(this).children().eq(i);
            //             szOrgLeft[(i - 1) / 2] = parseInt(divItem.css("left"));
            //             szOrgTop[(i - 1) / 2] = parseInt(divItem.css("top"));
            //         }
            //         //1div+1input组成动画
            //         $(this).children().hide();
            //         for (var i = 0; i < len; i += 2) {
            //             var divItem = $(this).children().eq(i);
            //             var inpItem = $(this).children().eq(i + 1);
            //             var jsonStr = inpItem[0].value;
            //             var data = eval('(' + jsonStr + ')');
            //             var demoAnimation = divItem[0];
            //             if ($(demoAnimation).is(":animated")) $(demoAnimation).stop(true, true);
            //             if (!$(demoAnimation).data("itemTop")) $(demoAnimation).data("itemTop", szOrgTop[(i - 1) / 2]);
            //             if (!$(demoAnimation).data("itemLeft")) $(demoAnimation).data("itemLeft", szOrgLeft[(i - 1) / 2]);
            //             if (!$(demoAnimation).data("spaceW")) $(demoAnimation).data("spaceW", $(demoAnimation).width());
            //             if (!$(demoAnimation).data("spaceH")) $(demoAnimation).data("spaceH", $(demoAnimation).height());
            //             var itemTop = $(demoAnimation).data("itemTop");
            //             var itemLeft = $(demoAnimation).data("itemLeft");
            //             var spaceW = $(demoAnimation).data("spaceW");
            //             var spaceH = $(demoAnimation).data("spaceH");
            //             var uid = data.states[0].animations[0].uid;
            //             var Adata = { 'Demo': divItem, 'winW': winW, 'winH': winH, 'itemTop': itemTop, 'itemLeft': itemLeft, 'spaceW': spaceW, 'spaceH': spaceH, 'animate': data.states[0].animations[0] };
            //             // Animation1(Adata.Demo, Adata, Adata.animate.type, Adata.animate.effect, Adata.animate.direction, Adata.animate.playDelay, Adata.animate.playTime);
            //             console.log('Adata', Adata.Demo)
            //         }
            //     }

            //     //提升非buttonItem的z-index
            //     //样张:风能工程第1页
            //     var isHasBtnItem = false;
            //     for (var idx = 0; idx < iLenth; idx++) {
            //         var item = client.children().eq(idx);
            //         var btnNodes = item.find("div[title='Button']");
            //         if (btnNodes.length !== 0) {
            //             isHasBtnItem = true;
            //         }

            //         if (isHasBtnItem === true && btnNodes.length === 0) {
            //             item.css("zIndex", 80);
            //         }
            //     }

            // });

            //进入,单击
            for (var i = 0; i < animation_list.length; i++) {
                if (!animation_list[i])
                    continue;
                for (var j = 0; j < animation_list[i].length; j++) {
                    var data = animation_list[i][j];
                    var triggerEvent = data.animate.type.charAt(data.animate.type.length - 1);
                    //var btnNodes = data.Demo.find("div[title='Button']");
                    var parentNodes = data.Demo.parents("div[title='PopupContent']");
                    //生物进化第3页
                    if (triggerEvent === '1' /* && btnNodes.length === 0*/ ) {
                        var curDemo = data.Demo[0];
                        var curPageDemo = curDemo;
                        while (curPageDemo && !curPageDemo.classList.contains("divshow")) curPageDemo = curPageDemo.parentNode;
                        //添加一个闭包隔离作用域，防止for循环中的j发生改变，导致与预期效果不符合
                        (function(curJ, curDemo) {
                            if (curPageDemo) $(curPageDemo).on('click', pointerDownEvent);

                            function pointerDownEvent(event) {
                                event.preventDefault();
                                var curPopupNodes = $(curDemo).parents("div[title^='画面']");
                                if ($(curDemo).attr('mousedownCount') === '0' && (curPopupNodes.length === 0 || !(curPopupNodes.eq(0).css("display") === 'none'))) {
                                    $(curDemo).attr('mousedownCount', '1');
                                    var pos = parseInt($(curDemo).attr('arrayposi'));
                                    playAnimation(pos, 0.0, -1, curJ);
                                }
                            }
                            $(curDemo).attr('mousedownCount', '0'); //只会播放一次动画
                            $(curDemo).attr('arrayposi', i);
                            $(curDemo).attr('arrayposj', 0);
                            //							$(curDemo).css('pointer-events', 'auto');
                            //							if (data.animate.type.indexOf('toAppearance') >= 0) {//进入
                            //								curDemo.css('opacity', '0.0');
                            //							} 
                        })(j, curDemo)

                    }
                }
            }

        };

        //重置数据
        Animate.prototype.reset = function(option) {
            //进入,单击
            console.log('animation_list', animation_list)
            for (var i = 0; i < animation_list.length; i++) {
                if (!animation_list[i])
                    continue;
                for (var j = 0; j < animation_list[i].length; j++) {
                    var data = animation_list[i][j];
                    var triggerEvent = data.animate.type.charAt(data.animate.type.length - 1);
                    var btnNodes = data.Demo.find("div[title='Button']");
                    var parentNodes = data.Demo.parents("div[title='PopupContent']");
                    if (data.animate.type.indexOf('toAppearance') >= 0) { //进入
                        data.Demo.css('opacity', '0.0');
                    }
                    //生物进化第3页
                    if (triggerEvent === '1' && btnNodes.length === 0) {
                        data.Demo.attr('mousedownCount', '0'); //只会播放一次动画
                        data.Demo.attr('arrayposi', i);
                        data.Demo.attr('arrayposj', j);
                        data.Demo.css('pointer-events', 'auto');
                        var demoAnimation = data.Demo;
                        data.Demo.css({ 'display': 'block', 'left': demoAnimation.data('itemLeft'), 'top': demoAnimation.data('itemTop'), 'width': demoAnimation.data('spaceW'), 'height': demoAnimation.data('spaceH') });
                    } else if (triggerEvent !== '1' && data.animate.type.indexOf('toAppearance') >= 0) {
                        if (data.animate.effect === 'fade' ||
                            data.animate.effect === 'slide' ||
                            data.animate.effect === 'back' ||
                            data.animate.effect === 'fly' ||
                            data.animate.effect === 'pop'
                        ) {
                            data.Demo.css('display', 'none');
                        }
                    } else if (triggerEvent !== '1' && data.animate.type.indexOf('fromAppearance') >= 0) {
                        if (data.animate.effect === 'fade' ||
                            data.animate.effect === 'slide' ||
                            data.animate.effect === 'back' ||
                            data.animate.effect === 'fly' ||
                            data.animate.effect === 'pop'
                        ) {
                            var demoAnimation = data.Demo;
                            data.Demo.css({ 'display': 'block', 'left': demoAnimation.data('itemLeft'), 'top': demoAnimation.data('itemTop'), 'width': demoAnimation.data('spaceW'), 'height': demoAnimation.data('spaceH') });
                        }
                    }
                }
            }

            for (var i = 0; i < animation_list.length; i++) {
                if (!animation_list[i])
                    continue;
                for (var j = 0; j < animation_list[i].length; j++) {
                    var data = animation_list[i][j];
                    //触发事件:0--网页加载时;1--单击;2--与上一动画同时;3--在上一动画之后
                    var triggerEvent = data.animate.type.charAt(data.animate.type.length - 1);
                    //1.(网页加载时)动画
                    //2.弹出内容的(带单击事件)触发动画
                    //3.第一个动画,即使动画触发事件设置为与上一动画同时或者在上一动画之后,也立即执行
                    if ((triggerEvent === '0' && j === 0) || (i === 0 && j === 0 && (triggerEvent === '2' || triggerEvent === '3'))) {
                        var mobileDelay = firstAnimationDelay + parseFloat(data.animate.playDelay);
                        // Animation1(data.Demo, data, data.animate.type, data.animate.effect, data.animate.direction, mobileDelay, data.animate.playTime);
                        console.log('resetdata', data, data.Demo)
                            // $(data.Demo).children('div').animateCss(data.animate.effect)
                        $(data.Demo).children('div').addClass('animated ' + data.animate.effect)
                        waitTime = Number(mobileDelay) + Number(data.animate.playTime);
                        lasti = i;
                        lastj = j;
                    }
                    //如果上一个动画是在网页加载开始,并且当前动画与上一动画同时进行,并且是第一个同步的
                    else if (((i === lasti && j === lastj + 1) || (i === lasti + 1 && j === 0)) && triggerEvent === '2') {
                        nLastSynWithFirstAni = lasti;
                        waitTime = 0;
                    }

                    if (triggerEvent !== '0' && !(i === 0 && j === 0) && nFirstNonPageLoadAni === -1 && data.ctPopup === 0) {
                        nFirstNonPageLoadAni = i;
                    }
                }
            }

            playAnimation(nFirstNonPageLoadAni, waitTime, nLastSynWithFirstAni);
        };

        //数据重置
        Animate.prototype.destroy = function() {
            clearTimeout(stopId);
            for (var i = 0; i < animation_list.length; i++) {
                if (!animation_list[i])
                    continue;
                for (var j = 0; j < animation_list[i].length; j++) {
                    var data = animation_list[i][j];
                    if (data.Demo.is(":animated"))
                        data.Demo.stop(true, true);
                }
            }
        };

        function Animation1(demo, data, type, effect, direction, playDelay, playTime) {
            //进入时渐隐
            if (type.search("fromAppearance") !== -1 && effect === "fade") {
                demo.css({ 'display': 'block', 'opacity': 1 });
            }
            if (playDelay > 0) {
                setTimeout(function() {
                    if ((type.search("toAppearance") !== -1 && effect == "fall" && direction == "bottom") ||
                        (type.search("toAppearance") !== -1 && effect == "fly" && direction == "bottom") ||
                        (type.search("toAppearance") !== -1 && effect == "fade" && direction == "bottom")) {
                        demo.css({ 'display': 'block', 'opacity': 0 });
                    } else {
                        demo.css({ 'display': 'block', 'opacity': 1 });
                    }
                    switch (effect) {
                        case "none":
                            break;
                        case "fade": //渐隐 
                            fade(demo, type, playDelay, playTime);
                            break;
                        case "slide": //滑动
                            slide(demo, data, type, direction, playDelay, playTime);
                            break;
                        case "back": //回弹
                            back(demo, data, type, direction, playDelay, playTime);
                            break;
                        case "fall": //跌落
                            fall(demo, data, type, playDelay, playTime);
                            break;
                        case "fly": //飞升
                            fly(demo, data, type, playDelay, playTime);
                            break;
                        case "pop": //冒泡
                            pop(demo, data, type, playDelay, playTime);
                            break;
                        case "flip": //翻转
                            flip(demo, data, type, playDelay, playTime);
                            break;
                        default:
                            break;
                    }
                    demo.dequeue("x1");
                }, playDelay * timePlus);
            } else {
                if ((type.search("toAppearance") !== -1 && effect == "fall" && direction == "bottom") ||
                    (type.search("toAppearance") !== -1 && effect == "fly" && direction == "bottom") ||
                    (type.search("toAppearance") !== -1 && effect == "fade" && direction == "bottom")) {
                    demo.css({ 'display': 'block', 'opacity': 0 });
                } else {
                    demo.css({ 'display': 'block', 'opacity': 1 });
                }
                switch (effect) {
                    case "none":
                        break;
                    case "fade": //渐隐 
                        fade(demo, type, playDelay, playTime);
                        break;
                    case "slide": //滑动
                        slide(demo, data, type, direction, playDelay, playTime);
                        break;
                    case "back": //回弹
                        back(demo, data, type, direction, playDelay, playTime);
                        break;
                    case "fall": //跌落
                        fall(demo, data, type, playDelay, playTime);
                        break;
                    case "fly": //飞升
                        fly(demo, data, type, playDelay, playTime);
                        break;
                    case "pop": //冒泡
                        pop(demo, data, type, playDelay, playTime);
                        break;
                    case "flip": //翻转
                        flip(demo, data, type, playDelay, playTime);
                        break;
                    default:
                        break;
                }
                demo.dequeue("x1");
            }
        }

        function playAnimation(i, waitTime, nSynWithFirstAni, j) {
            if (i < 0 || i >= animation_list.length)
                return;
            if (animation_list[i] === undefined) {
                playAnimation(i + 1, 0);
                return;
            }
            var j = j || 0;
            var data = animation_list[i][j];
            var timei = Number(data.animate.playDelay) + Number(data.animate.playTime);
            var triggerEvent = data.animate.type.charAt(data.animate.type.length - 1);
            var mousedownCount = data.Demo.attr('mousedownCount');
            var arrayposj = parseInt(data.Demo.attr('arrayposj'));
            if (triggerEvent === '1' && mousedownCount === '1') {
                data.Demo.attr('mousedownCount', '0');
                if (arrayposj >= animation_list[i].length)
                    return;
                data.Demo.attr('arrayposj', arrayposj + 1);
                var dataDown = animation_list[i][arrayposj];
                var mobileDelay = parseFloat(dataDown.animate.playDelay);
                Animation1(dataDown.Demo, dataDown, dataDown.animate.type, dataDown.animate.effect, dataDown.animate.direction, dataDown.animate.playDelay, dataDown.animate.playTime);
                playAnimation(i + 1, timei);
            } else if (triggerEvent === '2') {
                var mobileDelay = parseFloat(data.animate.playDelay);
                //是否和第一个动画同时加载(不计入动画延迟)
                if (i === nLastSynWithFirstAni + 1) {
                    mobileDelay += firstAnimationDelay;
                    nLastSynWithFirstAni += 1;
                }
                Animation1(data.Demo, data, data.animate.type, data.animate.effect, data.animate.direction, mobileDelay, data.animate.playTime);
                playAnimation(i + 1, timei);
            } else if (triggerEvent === '3') {
                //在上一动画之后开始
                stopId = setTimeout(function() {
                    Animation1(data.Demo, data, data.animate.type, data.animate.effect, data.animate.direction, data.animate.playDelay, data.animate.playTime);
                    var timei = Number(data.animate.playDelay) + Number(data.animate.playTime);
                    playAnimation(i + 1, timei, nLastSynWithFirstAni);
                }, waitTime * timePlus + 20); //给连续两个动画之间增加20/1000秒时间,用于缓冲(animate和setTimeout可能时间上有轻微差异)
            }
        }

        function PlayInteractiveInAnimation(showNode) {
            PlayAudioInAnimation(showNode);
        }

        function PlayAudioInAnimation(showNode) {
            var audionodes = showNode.find("audio");
            for (var i = 0; i < audionodes.length; i++) {
                var inputJson = $(audionodes[i]).next('input');
                if (inputJson.length === 0)
                    continue;
                var jsonStr = inputJson[0].value;
                var dataObj = eval('(' + jsonStr + ')');
                if (dataObj.playOnPageTurn !== "true")
                    continue;
                var duration = audionodes[i].duration;
                if (duration)
                    audionodes[i].currentTime = 0;
                audionodes[i].play();
            }
        }

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
function addArrowClickListener(arrow) {
    arrow.addEventListener("click", function() {
        mySwiper.slideNext();
    }, false);
}

function removeSwiping() {
    var slides = mySwiper.slides;
    slides = Array.prototype.slice.call(slides);
    slides.forEach(function(el) {
        // el.classList.add("swiper-no-swiping");
    });
}

window.onloadOver = function() {
    window.sizeAdjustor.adjustContainer();
    var scale = window.sizeAdjustor.scaleX;
    var bgmDiv = document.getElementById("divbgm");
    bgmDiv.style.left = (sizeAdjustor.finalLeft + sizeAdjustor.finalSize.width - 50) + "px";

    var jsonData = sizeAdjustor.jsonData;
    var showSwipIcon = jsonData.pageturning[0].pageicon === "true";
    window.dataController = new DataController(jsonData);
    window.bgmController = new BGMController(jsonData.bgmarea, jsonData.bgmhideicon);
    bgmController.controlAutoBgm(0, undefined);
    var effects = {
        "Traslation": "slide",
        "Fad": "fade",
        "CoverFlow": "coverflow",
        "Overturn": "flip",
        "3DTurn": "cube"
    };


    //实例化一个FXH5对象并对第一页reset
    window.fx = new FXH5(fx_options);
    // fx.reset("0");

    (function($) {
        alert(1)
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
    const intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((item) => {
            if (item.isIntersecting) {
                // fx.reset('0')
                var n = $(item.target).parent().children('input')
                var value = eval('(' + n[0].value + ')')
                    // value.states[0].animations[0].effect
                $(item.target).animateCss('animated ' + 'fadeIn')
                alert($(item.target).attr('class'))

            }
        })
    });
    console.log('divanimation', $("div[title='Animation']"))
        // 监听每一个有动画内包含的div元素是否进入视窗
    $("div[title='Animation']").children('div').each(function(index, item) {
        alert(2)
        intersectionObserver.observe(item)
    })

    // (function() {
    //     var arrow = document.getElementById("floatArrow");
    //     if (showSwipIcon) addArrowClickListener(arrow);
    //     else {
    //         arrow.style.display = "none";
    //     }

    // })();


};


(function(global, undefined) {
    if (is_weixin()) {
        if (top === global) {
            var bgmAudio, audio, isReady = false;
            document.addEventListener("WeixinJSBridgeReady", function() {
                bgmAudio = document.getElementById("aubgm");
                audio = document.getElementById("au1");
                bgmAudio.load();
                audio.load();
                isReady = true;
            }, false);
            global.playAgentAudio = function(localAudio) {
                var count = 0;
                var timer = setInterval(function() {
                    if (isReady) {
                        clearInterval(timer);
                        audio.src = localAudio.src;
                        audio.loop = localAudio.loop;
                        if (count < 100) audio.play();
                    }
                    count++;
                }, 100);
                return true;
            }
            global.pauseAgentAudio = function(localAudio) {
                audio.pause();
            }
            global.isAgentAudioEnded = function(localAudio) {
                return localAudio ? audio.ended || audio.paused : true;
            }
            global.playBgmAudio = function(bgmAudio) {
                var count = 0;
                var timer = setInterval(function() {
                    if (isReady) {
                        clearInterval(timer);
                        if (count < 100) bgmAudio.play();
                    }
                    count++;
                }, 100);
                return true;
            }
            global.pauseBgmAudio = function(bgmAudio) {
                bgmAudio.pause();
            }

        } else {
            global.playAgentAudio = function(localAudio) {
                global.agentAudioEnded = false;
                doExecBgAudio("au1", "play", localAudio.src, localAudio.loop);
                return true;
            }
            global.pauseAgentAudio = function(localAudio) {
                doExecBgAudio("au1", "pause", localAudio.src, localAudio.loop);
            }
            global.isAgentAudioEnded = function(localAudio) {
                return localAudio ? global.agentAudioEnded : true;
            }
            global.playBgmAudio = function(bgmAudio) {
                global.bgmAudioEnded = false;
                doExecBgAudio("aubgm", "play", bgmAudio.src, bgmAudio.loop);
                return true;
            }
            global.pauseBgmAudio = function(bgmAudio) {
                doExecBgAudio("aubgm", "pause", bgmAudio.src, bgmAudio.loop);
            }
        }
    } else {
        global.playAgentAudio = function(localAudio) {
            localAudio.play();
            return !localAudio.paused;
        }
        global.pauseAgentAudio = function(localAudio) {
            localAudio.pause();
        }
        global.isAgentAudioEnded = function(localAudio) {
            return localAudio ? localAudio.ended || localAudio.paused : true;
        }
        global.playBgmAudio = function(bgmAudio) {
            bgmAudio.play();
            return !bgmAudio.paused;
        }
        global.pauseBgmAudio = function(bgmAudio) {
            bgmAudio.pause();
        }
    }

    /* 跨域执行 */
    var exec_frame = null;
    var exec_frame_loaded = true;
    /*
     * @param element audio元素id
     * @param operate -play 播放  -pause 暂停
     * @param src 音乐资源路径
     * @param loop  是否重复
     */
    function doExecBgAudio(element, operate, src, loop) {
        if (!exec_frame_loaded) {
            setTimeout(function() {
                console.log("loading.....");
                doExecBgAudio(element, operate, src, loop);
            }, 100);
            return;
        } else {
            var param = "element=" + element + "&operate=" + operate + "&src=" + src + "&loop=" + loop;
            console.log("param===" + param);
            console.log("now time == " + new Date().getTime() + "  isloaded == " + exec_frame_loaded);
            var aimsrc = document.referrer.substring(0, document.referrer.lastIndexOf("/") + 1) + "crossDomainPage?";
            aimsrc += param;
            exec_frame = document.getElementById("exec_frame");
            if (exec_frame == null) {
                exec_frame = document.createElement('iframe');
                exec_frame.id = 'exec_frame';
                exec_frame.style.display = 'none';
                document.body.appendChild(exec_frame);
            }
            exec_frame_loaded = false;
            if (exec_frame.attachEvent) {
                exec_frame.attachEvent("onload", function() {
                    //iframe加载完成后你需要进行的操作    
                    exec_frame_loaded = true;
                    console.log("exec frame loaded!  src == " + exec_frame.src);
                });
            } else {
                exec_frame.onload = function() {
                    //iframe加载完成后你需要进行的操作    
                    exec_frame_loaded = true;
                    console.log("exec frame loaded!  src == " + exec_frame.src);
                };
                exec_frame.src = aimsrc;
            }
        }
    }
})(this);
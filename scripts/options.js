var fx_options = {
    "0": [{ container: "si_8000019A", plugin: "animate", option: {} },
        { container: "si_800001D1", plugin: "animate", option: {} },
    ],
};
(function() {
    window.FX = window.FX || {};
    var paths = [
            'observe.polyfill.min.js',
            'core/interface.js',
            'core/fx.js',
            'core/utils.js',
            // 'plugins/animation.js',
            'plugins/animate.js'
        ],
        baseURL = './scripts/';
    for (var i = 0, pi; pi = paths[i++];) {
        var extension = pi.split('.').pop();
        if (extension === 'css') {
            document.write('<link rel="stylesheet" type="text/css" href="' + baseURL + pi + '"></link>');
        } else {
            document.write('<script type="text/javascript" src="' + baseURL + pi + '?timestamp=' +
                FX.version +
                '"></script>');
        }
    }
})();
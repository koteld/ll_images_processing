(function () {
    'use strict';

    const wasm = require('./main.rs')  
    
    let wmodule;  
    let grayScale, invert, noise, sobelFilter, brighten;

    async function loadWasm() {
        wasm.initialize({noExitRuntime: true}).then(module => {
            wmodule = module;
            grayScale     = module.cwrap('gray_scale', 'number', ['number', 'number']);    
            invert        = module.cwrap('invert', 'number', ['number', 'number']);    
            noise         = module.cwrap('noise', 'number', ['number', 'number']);    
            brighten      = module.cwrap('brighten', 'number', ['number', 'number', 'number']);    
            sobelFilter   = module.cwrap('sobel_filter', 'number', ['number', 'number', 'number', 'number'])
        })   
    }

    loadWasm()   

}());

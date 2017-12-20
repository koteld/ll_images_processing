(function () {
    'use strict';

    const URL = window.webkitURL || window.URL;    
<<<<<<< HEAD
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
=======
    const wasm = require('./main.rs')    
    let grayScale
    // let invert
    // let noise
    // let sobelFilter
    // let brighten

    let pixels    
    // let dataHeap

    window.onload = function () {
        const input = document.getElementById('input');
        input.addEventListener('change', handleFiles, false);
    }

    function handleFiles(e) {
        const canvasElement = document.getElementById('canvas');
        const ctx = canvasElement.getContext('2d');
        const url = URL.createObjectURL(e.target.files[0]);
        const img = new Image();

        img.onload = function () {
            const { width, height } = img;
            canvasElement.width = width;
            canvasElement.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            pixels = ctx.getImageData(0, 0, width, height);   

            // dataHeap = new Uint8Array(module.HEAPU8.buffer, module._malloc(pixels.data.length * pixels.data.BYTES_PER_ELEMENT), 
            //                             pixels.data.length * pixels.data.BYTES_PER_ELEMENT);            

            // noise(dataHeap.byteOffset, pixels.data.length);
            // var result = new Uint8Array(dataHeap.buffer, dataHeap.byteOffset, pixels.data.length);               
            // pixels.data.set(new Uint8ClampedArray(result));
            // ctx.putImageData(pixels, 0, 0);

            wasm.initialize({noExitRuntime: true}).then(module => {
                const grayScale     = module.cwrap('gray_scale', 'number', ['number', 'number']);    
                const invert        = module.cwrap('invert', 'number', ['number', 'number']);    
                const noise         = module.cwrap('noise', 'number', ['number', 'number']);    
                const brighten      = module.cwrap('brighten', 'number', ['number', 'number', 'number']);    
                const sobelFilter   = module.cwrap('sobel_filter', 'number', ['number', 'number', 'number', 'number']);    
                
                var buf = module._malloc(pixels.data.length * pixels.data.BYTES_PER_ELEMENT);
                var dataHeap = new Uint8Array(module.HEAPU8.buffer, buf, pixels.data.length * pixels.data.BYTES_PER_ELEMENT);
                dataHeap.set(new Uint8Array(pixels.data.buffer));

                //let res = grayScale(dataHeap.byteOffset, pixels.data.length);
                //let res = invert(dataHeap.byteOffset, pixels.data.length);
                //let res = noise(dataHeap.byteOffset, pixels.data.length);
                //let res = brighten(dataHeap.byteOffset, pixels.data.length, 20);
                let res = sobelFilter(dataHeap.byteOffset, width, height, 0);
                var result = new Uint8Array(dataHeap.buffer, dataHeap.byteOffset, pixels.data.length);               
                pixels.data.set(new Uint8ClampedArray(result));

                ctx.putImageData(pixels, 0, 0);
            })         
        }
        img.src = url;
    }

    // async function loadWasm() {
    //     wasm.initialize({noExitRuntime: true}).then(module => {
    //         const grayScale     = module.cwrap('gray_scale', 'number', ['number', 'number']);    
    //         const invert        = module.cwrap('invert', 'number', ['number', 'number']);    
    //         const noise         = module.cwrap('noise', 'number', ['number', 'number']);    
    //         const brighten      = module.cwrap('brighten', 'number', ['number', 'number', 'number']);    
    //         const sobelFilter   = module.cwrap('sobel_filter', 'number', ['number', 'number', 'number', 'number'])
    //     })   
    // }

    // loadWasm()   
>>>>>>> dfc0fa178591c2bc7effc4f0a183141f814556d5

}());

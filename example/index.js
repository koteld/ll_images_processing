(function () {
    'use strict';

    const URL = window.webkitURL || window.URL;    
    const wasm = require('./main.rs')  
    let ctx;
    let wmodule;  
    let grayScale, invert, noise, sobelFilter, brighten;
    let filter = 'Normal', prevFilter;
    let pixels, pixels2;   
    let dataHeap
    let w, h
    
    window.onload = function () {
        addButtons();
        const input = document.getElementById('input');
        input.addEventListener('change', handleFiles, false);
    }
    
    function addButtons (filtersArr) {
        const filters = ['Normal', 'Grayscale', 'Invert', 'Noise', 'Sobel'];
        const buttonDiv = document.createElement('div');
        buttonDiv.id = 'filters';
        const editor = document.getElementById('editor')
        editor.insertBefore(buttonDiv, editor.firstChild);
        for (let i = 0; i < filters.length; i++) {
            let filterDiv = document.createElement('div');
            filterDiv.className = "indFilter";
            filterDiv.innerText = filters[i];

            filterDiv.addEventListener('click', function() {
                filter = filters[i];

                if(document.getElementsByClassName('selectedFilter')[0]) document.getElementsByClassName('selectedFilter')[0].classList.remove('selectedFilter');
                this.classList.add('selectedFilter');

                setPixels(filter);
            });
          buttonDiv.appendChild(filterDiv);
        }
    }

    function setPixels (filter) {
        dataHeap.set(new Uint8Array(pixels.data.buffer));
        switch (filter) {
            case 'Normal': break;            
            case 'Grayscale': grayScale(dataHeap.byteOffset, pixels.data.length); break;
            case 'Invert': invert(dataHeap.byteOffset, pixels.data.length); break;
            case 'Noise': noise(dataHeap.byteOffset, pixels.data.length); break;
            case 'Brighten': brighten(dataHeap.byteOffset, pixels.data.length, 20); break;
            case 'Sobel': sobelFilter(dataHeap.byteOffset, w, h, 0); break;            
        }
        pixels2.data.set(new Uint8ClampedArray(dataHeap))
        ctx.putImageData(pixels2, 0, 0)
    }    

    function handleFiles(e) {
        const canvasElement = document.getElementById('canvas');
        ctx = canvasElement.getContext('2d');
        const url = URL.createObjectURL(e.target.files[0]);
        const img = new Image();

        img.onload = function () {
            const { width, height } = img;
            w = width;
            h = height;
            canvasElement.width = width;
            canvasElement.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            pixels = ctx.getImageData(0, 0, width, height);   
            pixels2 = ctx.getImageData(0, 0, width, height);
            dataHeap = new Uint8Array(wmodule.HEAPU8.buffer, wmodule._malloc(pixels.data.length * pixels.data.BYTES_PER_ELEMENT), 
                pixels.data.length * pixels.data.BYTES_PER_ELEMENT);            
        }
        img.src = url;
    }

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

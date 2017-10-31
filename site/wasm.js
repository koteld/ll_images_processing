var Module = {};

function loadWASM() {
  return new Promise((resolve, reject) => {
    if (!('WebAssembly' in window)) {
      console.log('Couldn\'t load WASM');
    } else {
      fetch('wasm_rust.wasm')
        .then(response => response.arrayBuffer())
        .then(buffer => {
          Module.wasmBinary = buffer;
          // GLOBAL -- create custom event for complete glue script execution
          script = document.createElement('script');
          doneEvent = new Event('done');
          script.addEventListener('done', buildWam);
          // END GLOBAL

          // TODO: IN EMSCRIPTEN GLUE INSERT
          // else{doRun()} ...
          // script.dispatchEvent(doneEvent);
          // ... }Module["run"]

          script.src = 'wasm_rust.js';
          document.body.appendChild(script);

          function buildWam() {
            console.log('Emscripten boilerplate loaded.');
            const wam = {};

            // filters
            wam['gray_scale'] = function (pixel_data) {
              const len = pixel_data.length
              const mem = _malloc(len);
              HEAPU8.set(pixel_data, mem); 
              _grayScale(mem, len);
              const filtered = HEAPU8.subarray(mem, mem + len);
              _free(mem);
              return filtered;
            };
            wam['invert'] = function (pixel_data) {
              const len = pixel_data.length;
              const mem = _malloc(len);
              HEAPU8.set(pixel_data, mem);
              _invert(mem, len);
              const filtered = HEAPU8.subarray(mem, mem + len);
              _free(mem);
              return filtered;
            };
            // wam['noise'] = function (pixel_data) {
              // const len = pixel_data.length;
              // const mem = _malloc(len * Float32Array.BYTES_PER_ELEMENT);
              // HEAPF32.set(pixel_data, mem / Float32Array.BYTES_PER_ELEMENT);
              // _noise(mem, len);
              // const filtered = HEAPF32.subarray(mem / Float32Array.BYTES_PER_ELEMENT, mem / Float32Array.BYTES_PER_ELEMENT + len);
              // _free(mem);
              // return filtered;
            // };
            resolve(wam);
          };
        });
    }
  });
}
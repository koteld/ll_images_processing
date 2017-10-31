(function () {
    'use strict';

    const URL = window.webkitURL || window.URL;    
	
	let wam;
	let filter = 'Grayscale';
	
	loadWASM().then(module => {
		wam = module;
	}).catch((err) => {
		console.log('Error in fetching module: ', err);
	}).then(() => {
		window.onload = function () {
			// addButtons();
			// appendWasmCheck();
			const input = document.getElementById('input');
			input.addEventListener('change', handleFiles, false);
		};
	});
	
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

            const { data } = ctx.getImageData(0, 0, width, height);

			setPixels(filter, 'wasm')
            // webassembly works here
        }

        img.src = url;
    }
	
	function addButtons (filtersArr) {
		const filters = ['Grayscale', 'Invert'];
		const buttonDiv = document.createElement('div');
		buttonDiv.id = 'filters';
		const editor = document.getElementById("editor")
		editor.insertBefore(buttonDiv, editor.firstChild);
		for (let i = 0; i < filters.length; i++) {
			let filterDiv = document.createElement('div');
			filterDiv.className = "indFilter";
			filterDiv.innerText = filters[i];
			filterDiv.addEventListener('click', function() {
				filter = filters[i];
				//remove any that have it;
				// if(document.getElementsByClassName('selectedFilter')[0]) document.getElementsByClassName('selectedFilter')[0].classList.remove('selectedFilter');
				this.classList.add('selectedFilter');
			});
		buttonDiv.appendChild(filterDiv);
		}
	}
	
	function appendWasmCheck () {
	  let p = document.createElement('p');
	  p.className = 'wasmCheck';
	  let before = document.getElementById('editor');
	  if ('WebAssembly' in window) {
		p.innerHTML = '(\u2713 WebAssembly is supported in your browser)';
		document.body.insertBefore(p,before);
	  }
	  else if (/Mobi/.test(navigator.userAgent)) {
		document.getElementById('statsContainer').innerHTML = `<h3 style="color:#a37c6e;">\u2639 WebAssembly is not yet supported on mobile devices. Please view on desktop browser.</h3>`
	  }
	  else {
		document.getElementById('statsContainer').innerHTML = `<h3 style="color:#a37c6e;">\u2639 WebAssembly is not supported in your browser. Please update to the latest version of Chrome or Firefox to enable WebAssembly and compare .WASM & .JS performance</h3>`
	  }
	}
	

	function setPixels (filter, language) {
	  if (language === 'wasm') {
		let kernel, divisor;
		switch (filter) {
		  case 'Grayscale': pixels.data.set(wam.grayScale(pixels.data)); break;
		  case 'Invert': pixels.data.set(wam.invert(pixels.data)); break;
		  //case 'Noise': pixels.data.set(wam.noise(pixels.data)); break;
		}
	  }
	}

}());

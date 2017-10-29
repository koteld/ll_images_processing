(function () {
    'use strict';

    const URL = window.webkitURL || window.URL;

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

            const { data } = ctx.getImageData(0, 0, width, height);

            // webassembly works here
        }

        img.src = url;
    }
}());

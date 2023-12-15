const imgElement = document.getElementById('imageSrc'),
imgElement2 = document.getElementById('imageSrc2'),
hiddenCanvas = document.getElementById('hiddenCanvas'),
hiddenImage = document.getElementById('hiddenImage'),
inputElement = document.getElementById('fileInput'),
inputElement2 = document.getElementById('fileInput2'),
button = document.getElementById('action'),
formSelect = document.getElementById('method'),
canvasOutput = document.getElementById('canvasOutput'),
outputSection = document.getElementById('hasil'),
saveBtn = document.getElementById('save')
;

inputElement.addEventListener('change', (e) => {
  imgElement.src = URL.createObjectURL(e.target.files[0]);
  hiddenImage.src = URL.createObjectURL(e.target.files[0]);
}, false);

inputElement2.addEventListener('change', (e) => {
  imgElement2.src = URL.createObjectURL(e.target.files[0]);
}, false);

const imageAddition = () => {
    const src1 = cv.imread(imgElement);
    const src2 = cv.imread(imgElement2);
    let dst = new cv.Mat();
    let mask = new cv.Mat();
    let dtype = 1;
    cv.subtract(src2, src1, dst, mask, dtype);
    cv.imshow('canvasOutput', dst);
    src1.delete(); 
    src2.delete(); 
    dst.delete(); 
    mask.delete();
}

button.addEventListener('click', () => {
    imageAddition();
    afterAddtition();
});

const afterAddtition = () => {
  outputSection.hidden = false;
  window.location.href = "#hasil";
  saveBtn.hidden = false;
};

function downloadCanvas() {
  const dataURL = hiddenCanvas.toDataURL();
  const link = document.createElement('a');
  link.download = 'image.png';
  link.href = dataURL;
  link.click();
}

var Module = {
  // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
  onRuntimeInitialized() {
    document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
  }
}
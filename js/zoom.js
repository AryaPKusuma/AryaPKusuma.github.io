const imgElement = document.getElementById('imageSrc'),
hiddenCanvas = document.getElementById('hiddenCanvas'),
hiddenImage = document.getElementById('hiddenImage'),
inputElement = document.getElementById('fileInput'),
button = document.getElementById('action'),
canvasOutput = document.getElementById('canvasOutput'),
outputSection = document.getElementById('hasil'),
zoomFactor = document.getElementById('inputFactor'),
saveBtn = document.getElementById('save');

let factor = null;

zoomFactor.addEventListener('input', function(e) {
    factor = parseInt(e.target.value);
    console.log(factor);
  });

inputElement.addEventListener('change', (e) => {
  imgElement.src = URL.createObjectURL(e.target.files[0]);
  hiddenImage.src = URL.createObjectURL(e.target.files[0]);
}, false);

imgElement.onload = function() {
    button.removeAttribute('disabled');
  };

  hiddenImage.onload = function() {
    const canvas = document.getElementById('inputCanvas');
    const context = canvas.getContext('2d');
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    context.drawImage(imgElement, 0, 0);
  
    let file = fileInput.files[0];
    let fileSize = file.size;
    let fileSizeKB = fileSize / 1024;
    let fix = fileSizeKB.toFixed(2);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const bitDepth = imageData.data.BYTES_PER_ELEMENT * 8;
  
    const details = document.getElementById('inputDetails'); 
    details.innerHTML = `
    <p>Size: ${fix} KB</p>
    <p>Bit Depth: ${bitDepth}</p>
    <p>Width: ${hiddenImage.width}px</p>
    <p>Height: ${hiddenImage.height}px</p>
    `;
  };
  const getImageCanvasDetail = () => {
    //getWidth height
    const ctx = hiddenCanvas.getContext('2d');
    const width = hiddenCanvas.width;
    const height = hiddenCanvas.height;
    // getSize
    const dataURL = hiddenCanvas.toDataURL('image/jpeg');
    let sizeInBytes = dataURL.length;
    let sizeInKB = sizeInBytes / 1024;
    let size = sizeInKB.toFixed(2);
    // getbitDepth
    let imageData = ctx.getImageData(0, 0, width, height);
    let pixelDepth = imageData.data.BYTES_PER_ELEMENT * 8;
  
    const details = document.getElementById('outputDetails'); 
    details.innerHTML = `
    <p>Size: ${size} KB</p>
    <p>Bit Depth: ${pixelDepth}</p>
    <p>Width: ${width}px</p>
    <p>Height: ${height}px</p>
  `;
  }
const afterDenoise = () => {
  outputSection.hidden = false;
  window.location.href = "#hasil";
  saveBtn.hidden = false;
};

const zoom = () => {
  let src = cv.imread(imgElement);
  const dst = new cv.Mat();
  let fx = factor;
  let fy = factor;
  const dsize = new cv.Size(src.cols * fx, src.rows * fy);
  cv.resize(src, dst, dsize, fx, fy, cv.INTER_LINEAR);
  cv.imshow('canvasOutput', dst);
  src.delete();
  dst.delete();

  let hiddenSrc = cv.imread(hiddenImage);
  const hiddenDst = new cv.Mat();
  const hiddenFx = factor;
  const hiddenFy = factor;
  const hiddenDsize = new cv.Size(hiddenSrc.cols * hiddenFx, hiddenSrc.rows * hiddenFy);
  cv.resize(hiddenSrc, hiddenDst, hiddenDsize, hiddenFx, hiddenFy, cv.INTER_LINEAR);
  cv.imshow(hiddenCanvas, hiddenDst);
  hiddenSrc.delete();
  hiddenDst.delete();
};

button.addEventListener('click', () => {
  zoom();
  afterDenoise();
  getImageCanvasDetail();
});

function downloadCanvas() {
  const dataURL = canvasOutput.toDataURL();
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
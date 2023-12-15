const imgElement = document.getElementById('imageSrc'),
hiddenCanvas = document.getElementById('hiddenCanvas'),
hiddenImage = document.getElementById('hiddenImage'),
inputElement = document.getElementById('fileInput'),
button = document.getElementById('action'),
canvasOutput = document.getElementById('canvasOutput'),
outputSection = document.getElementById('hasil'),
saveBtn = document.getElementById('save')
;

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
const inputHistogramRGB = () => {
  const img = document.getElementById('inputCanvas');

  const histogramCanvas = document.getElementById('inputHistogram');
  const context = img.getContext('2d');
  const imageData = context.getImageData(0, 0, img.width, img.height);
  const data = imageData.data;

  const redHistogram = {};
  const greenHistogram = {};
  const blueHistogram = {};
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    redHistogram[r] = (redHistogram[r] || 0) + 1;
    greenHistogram[g] = (greenHistogram[g] || 0) + 1;
    blueHistogram[b] = (blueHistogram[b] || 0) + 1;
}

  const redLabels = Object.keys(redHistogram);
  const redValues = Object.values(redHistogram);
  // const greenLabels = Object.keys(greenHistogram);
  const greenValues = Object.values(greenHistogram);
  // const blueLabels = Object.keys(blueHistogram);
  const blueValues = Object.values(blueHistogram);

  // Create the chart using Chart.js
  new Chart(histogramCanvas, {
  type: 'bar',
  data: {
    labels: redLabels,
    datasets: [
      {
        label: 'R',
        data: redValues,
        backgroundColor: 'red',
      },
      {
        label: 'G',
        data: greenValues,
        backgroundColor: 'green',
      },
      {
        label: 'B',
        data: blueValues,
        backgroundColor: 'blue',
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Channel Value',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Frequency',
        },
      },
    },
  },
});
}

const outputHistogramRGB = () => {
  const img = document.getElementById('canvasOutput');

  const histogramCanvas = document.getElementById('histogramCanvas');
  const context = img.getContext('2d');
  const imageData = context.getImageData(0, 0, img.width, img.height);
  const data = imageData.data;

  const redHistogram = {};
  const greenHistogram = {};
  const blueHistogram = {};
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    redHistogram[r] = (redHistogram[r] || 0) + 1;
    greenHistogram[g] = (greenHistogram[g] || 0) + 1;
    blueHistogram[b] = (blueHistogram[b] || 0) + 1;
}

  const redLabels = Object.keys(redHistogram);
  const redValues = Object.values(redHistogram);
  // const greenLabels = Object.keys(greenHistogram);
  const greenValues = Object.values(greenHistogram);
  // const blueLabels = Object.keys(blueHistogram);
  const blueValues = Object.values(blueHistogram);

  // Create the chart using Chart.js
  new Chart(histogramCanvas, {
  type: 'bar',
  data: {
    labels: redLabels,
    datasets: [
      {
        label: 'R',
        data: redValues,
        backgroundColor: 'red',
      },
      {
        label: 'G',
        data: greenValues,
        backgroundColor: 'green',
      },
      {
        label: 'B',
        data: blueValues,
        backgroundColor: 'blue',
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Channel Value',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Frequency',
        },
      },
    },
  },
});
}
const afterDenoise = () => {
  outputSection.hidden = false;
  window.location.href = "#hasil";
  saveBtn.hidden = false;
};

const denoise = () => {
  let src = cv.imread(imgElement);
  let dst = new cv.Mat();
  let blur = new cv.Mat();
  cv.cvtColor(src, dst, cv.COLOR_RGBA2RGB, 0);
  cv.medianBlur(src, blur, 5);
  cv.imshow('canvasOutput', blur);
  src.delete();
  dst.delete();
  blur.delete();

  let hiddenSrc = cv.imread(hiddenImage);
  let hiddenDst = new cv.Mat();
  let hiddenBlur = new cv.Mat();
  cv.cvtColor(hiddenSrc, hiddenDst, cv.COLOR_RGBA2RGB, 0);
  cv.medianBlur(hiddenSrc, hiddenBlur, 5);
  cv.imshow(hiddenCanvas, hiddenBlur);
  hiddenSrc.delete();
  hiddenDst.delete();
  hiddenBlur.delete();
};

button.addEventListener('click', () => {
  denoise();
  inputHistogramRGB();
  outputHistogramRGB();
  getImageCanvasDetail();
  afterDenoise();
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
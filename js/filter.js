const preview = document.getElementById('imageSrc'),
imgElement = document.getElementById('imageSrc2'),
inputElement = document.getElementById('fileInput'),
selecFilter = document.getElementById('filter'),
btnConvert = document.getElementById('convert'),
brightnessSlider = document.getElementById('brightness'),
brightnessLabel = document.getElementById('brightnessLabel'),
canvasOutput = document.getElementById('canvasOutput'),
hiddenCanvas = document.getElementById('hidden-canvas'),
outputSection = document.getElementById('hasil'),
btnSave = document.getElementById('save');

let brightness = 0;

let ctx = hiddenCanvas.getContext('2d');
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";

const inputBrightness = () => {
  brightnessLabel.innerHTML = brightnessSlider.value;
  brightness = parseInt(brightnessSlider.value);
  console.log(brightnessSlider.value);
}

inputElement.addEventListener('change', (e) => {
  preview.src = URL.createObjectURL(e.target.files[0]);
  imgElement.src = URL.createObjectURL(e.target.files[0]);
  console.log(e.target.files[0]);
}, false);

const moveWindow = () => {
  outputSection.hidden = false;
  window.location.href = "#hasil";
};

imgElement.onload = function() {
  brightnessSlider.removeAttribute('disabled');
  btnConvert.removeAttribute('disabled');
  selecFilter.removeAttribute('disabled');
};

preview.onload = function() {
  const canvas = document.getElementById('inputCanvas');
  const context = canvas.getContext('2d');

  canvas.width = imgElement.width;
  canvas.height = imgElement.height;

  context.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

  let file = fileInput.files[0];
  let fileSize = file.size;
  let fileSizeKB = fileSize / 1024;
  let fix = fileSizeKB.toFixed(2);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const bitDepth = imageData.data.BYTES_PER_ELEMENT * 8;
  // const bitDepth = getBitDepth(context);
  const details = document.getElementById('inputDetails'); 
  details.innerHTML = `
  <p>Size: ${fix} KB</p>
  <p>Bit Depth: ${bitDepth}</p>
  <p>Width: ${canvas.width}px</p>
  <p>Height: ${canvas.height}px</p>
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


const filterNegative = () => {
  let src = cv.imread(preview);
  let dst = new cv.Mat();
  let neg = new cv.Mat();
  // if (src.channels() == 4) {
  cv.cvtColor(src, dst, cv.COLOR_BGRA2RGB);
  // } else if (src.channels() == 3)
  // {
  //   cv.cvtColor(src, dst, cv.COLOR_BGR2RGB);
  // }
  dst.convertTo(dst, -1, 1, brightness);
  cv.bitwise_not(dst, neg);
  cv.imshow('canvasOutput', neg);
  src.delete();
  dst.delete();
  neg.delete();


  let hiddenSrc = cv.imread(imgElement);
  let hiddenDst = new cv.Mat();
  let hiddenNeg = new cv.Mat();
  cv.cvtColor(hiddenSrc, hiddenDst, cv.COLOR_BGRA2RGB);
  hiddenDst.convertTo(hiddenDst, -1, 1, brightness);
  cv.bitwise_not(hiddenDst, hiddenNeg);
  cv.imshow(hiddenCanvas, hiddenNeg);
  hiddenSrc.delete();
  hiddenDst.delete();
  hiddenNeg.delete();
};

const filterGrayscale = () => {
  let src = cv.imread(preview);
  let dst = new cv.Mat();
  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
  dst.convertTo(dst, -1, 1, brightness);
  cv.imshow('canvasOutput', dst);
  src.delete();
  dst.delete();

  let hiddenSrc = cv.imread(imgElement);
  let hiddenDst = new cv.Mat();
  cv.cvtColor(hiddenSrc, hiddenDst, cv.COLOR_RGBA2GRAY);
  hiddenDst.convertTo(hiddenDst, -1, 1, brightness);
  cv.imshow(hiddenCanvas, hiddenDst);
  hiddenSrc.delete();
  hiddenDst.delete();
}

const histogramGray = () => {
  // target input image to calculate histogram
  const canvas = document.getElementById('canvasOutput');

  // target canvas to output histgram
  const histogramCanvas = document.getElementById('histogramCanvas');
  const context = canvas.getContext('2d');
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Calculate the frequency of each pixel value
  const histogram = {};
  for (let i = 0; i < data.length; i += 4) {
    const pixelValue = data[i]; // Assuming grayscale image
    histogram[pixelValue] = (histogram[pixelValue] || 0) + 1;
  }
  
  const labels = Object.keys(histogram);
  const values = Object.values(histogram);

  new Chart(histogramCanvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Histogram',
        data: values,
        backgroundColor: 'black',
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { 
          display: true,
          title: {
            display: true,
            text: 'Pixel Value'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Frequency'
          }
        }
      }
    }
  });
}

const histogramOutputRgb = () => {
  const img = document.getElementById('canvasOutput');

  // target canvas to output histgram
  const histogramCanvas = document.getElementById('histogramCanvas');
  const context = img.getContext('2d');
  const imageData = context.getImageData(0, 0, img.width, img.height);
  const data = imageData.data;

// Calculate the frequency of each RGB value
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

// Convert the histogram data to arrays for Chart.js
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
const histogramRgb = () => {
  // target input image to calculate histogram
  const img = document.getElementById('inputCanvas');

  // target canvas to output histgram
  const histogramCanvas = document.getElementById('inputHistogram');
  const context = img.getContext('2d');
  const imageData = context.getImageData(0, 0, img.width, img.height);
  const data = imageData.data;

// Calculate the frequency of each RGB value
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

// Convert the histogram data to arrays for Chart.js
const redLabels = Object.keys(redHistogram);
const redValues = Object.values(redHistogram);
const greenLabels = Object.keys(greenHistogram);
const greenValues = Object.values(greenHistogram);
const blueLabels = Object.keys(blueHistogram);
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
const filterBiner = () => {
  let src = cv.imread(preview);
  let dst = new cv.Mat();
  cv.cvtColor(src, dst, cv.COLOR_RGB2GRAY); 
  cv.threshold(dst, dst, 128, 255, cv.THRESH_BINARY);
  cv.imshow('canvasOutput', dst);
  src.delete();
  dst.delete();


  let hiddenSrc = cv.imread(imgElement);
  let hiddenDst = new cv.Mat();
  cv.cvtColor(hiddenSrc, hiddenDst, cv.COLOR_RGBA2GRAY);
  cv.threshold(hiddenDst, hiddenDst, 128, 255, cv.THRESH_BINARY);
  // hiddenDst.convertTo(hiddenDst, -1, 1, brightness);
  cv.imshow(hiddenCanvas, hiddenDst);
  hiddenSrc.delete();
  hiddenDst.delete();
}

const filterNone = () => {
  const src = cv.imread(preview);
  const dst = new cv.Mat();
  cv.cvtColor(src, dst, cv.COLOR_RGBA2RGB);
  dst.convertTo(dst, -1, 1, brightness);
  cv.imshow('canvasOutput', dst);
  src.delete();
  dst.delete();


  let hiddenSrc = cv.imread(imgElement);
  let hiddenDst = new cv.Mat();
  cv.cvtColor(hiddenSrc, hiddenDst, cv.COLOR_RGBA2RGB);
  hiddenDst.convertTo(hiddenDst, -1, 1, brightness);
  cv.imshow(hiddenCanvas, hiddenDst);
  hiddenSrc.delete();
  hiddenDst.delete();
}

function getImageSize(image) {
  // Calculate image size in KB
  const fileSizeInBytes = image.src.length;
  const fileSizeInKB = fileSizeInBytes / 1024;
  return fileSizeInKB.toFixed(2);
}

btnConvert.addEventListener('click', () => {
  histogramRgb();

  if (selecFilter.value == '1') {
      // grayscale
      filterGrayscale();
      histogramGray();
  } else if (selecFilter.value == '2') {
      // negative
      filterNegative();
      histogramOutputRgb();
  } else if (selecFilter.value == '3') {
      // biner
      filterBiner();
      histogramGray();
  } else if (selecFilter.value == '4') {
      // none
      filterNone();
      histogramOutputRgb();
  }
  btnSave.hidden = false;
  moveWindow();
  getImageCanvasDetail();
});

function downloadCanvas() {
  const data = hiddenCanvas.toDataURL();
  const link = document.createElement('a');
  link.download = 'image.png';
  link.href = data;
  link.click();
}

brightnessSlider.addEventListener("click", inputBrightness);

var Module = {
  // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
  onRuntimeInitialized() {
    document.getElementById('status').innerHTML = 'Status : OpenCV.js is ready.';
  }
}
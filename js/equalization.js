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
const imageData = context.getImageData(0, 0, 1, 1).data;
const bitDepth = imageData.length * 8;

console.log(canvas.width);
console.log(canvas.height);
console.log(fix);
console.log(bitDepth);

const details = document.getElementById('inputDetails'); 
details.innerHTML = `
<p>Size: ${fix} KB</p>
<p>Bit Depth: ${bitDepth}</p>
<p>Width: ${hiddenImage.width}px</p>
<p>Height: ${hiddenImage.height}px</p>
`;
};
const afterDenoise = () => {
  outputSection.hidden = false;
  window.location.href = "#hasil";
  saveBtn.hidden = false;
};

const equalization = () => {
    let src = cv.imread(imgElement);
    let dst = new cv.Mat();
    let hsvPlanes = new cv.MatVector();
    let mergedPlanes = new cv.MatVector();
    cv.cvtColor(src, src, cv.COLOR_RGB2HSV, 0);
    cv.split(src, hsvPlanes);
    let H = hsvPlanes.get(0);
    let S = hsvPlanes.get(1);
    let V = hsvPlanes.get(2);
    cv.equalizeHist(V, V);
    mergedPlanes.push_back(H);
    mergedPlanes.push_back(S);
    mergedPlanes.push_back(V);
    cv.merge(mergedPlanes, src);
    cv.cvtColor(src, dst, cv.COLOR_HSV2RGB, 0);
    cv.imshow("canvasOutput", dst); // canavas element with canvasOutput id
    src.delete();
    dst.delete();
    hsvPlanes.delete();
    mergedPlanes.delete();

    let hiddenSrc = cv.imread(hiddenImage);
    let hiddenDst = new cv.Mat();
    let hiddenHsvPlanes = new cv.MatVector();
    let hiddenMergedPlanes = new cv.MatVector();
    cv.cvtColor(hiddenSrc, hiddenSrc, cv.COLOR_RGB2HSV, 0);
    cv.split(hiddenSrc, hiddenHsvPlanes);
    let hiddenH = hiddenHsvPlanes.get(0);
    let hiddenS = hiddenHsvPlanes.get(1);
    let hiddenV = hiddenHsvPlanes.get(2);
    cv.equalizeHist(hiddenV, hiddenV);
    hiddenMergedPlanes.push_back(hiddenH);
    hiddenMergedPlanes.push_back(hiddenS);
    hiddenMergedPlanes.push_back(hiddenV);
    cv.merge(hiddenMergedPlanes, hiddenSrc);
    cv.cvtColor(hiddenSrc, hiddenDst, cv.COLOR_HSV2RGB, 0);
    cv.imshow(hiddenCanvas, hiddenDst); // canavas element with canvasOutput id
    hiddenSrc.delete();
    hiddenDst.delete();
    hiddenHsvPlanes.delete();
    hiddenMergedPlanes.delete();
  };
  

const histogramSingleChannel = () => {
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

  const histogramRGB = () => {
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

button.addEventListener('click', () => {
  histogramRGB();
  equalization();
  afterDenoise();
  getImageCanvasDetail();
  histogramOutputRgb();
});

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
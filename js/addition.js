const imgElement = document.getElementById('imageSrc'),
imgElement2 = document.getElementById('imageSrc2'),
hiddenCanvas = document.getElementById('hiddenCanvas'),
hiddenImage = document.getElementById('hiddenImage'),
hiddenImage2 = document.getElementById('hiddenImage2'),
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
  hiddenImage2.src = URL.createObjectURL(e.target.files[0]);
}, false);

const imageAddition = () => {
    const src1 = cv.imread(imgElement);
    const src2 = cv.imread(imgElement2);
    let dst = new cv.Mat();

    cv.addWeighted(src1, 0.5, src2, 0.5, 0, dst);
    cv.imshow('canvasOutput', dst);

    src1.delete(); 
    src2.delete(); 
    dst.delete(); 

    const src3 = cv.imread(hiddenImage);
    const src4 = cv.imread(hiddenImage2);
    let hiddenDst = new cv.Mat();
    cv.addWeighted(src3, 0.6, src4, 0.6, 0, hiddenDst);

    cv.imshow('hiddenCanvas', hiddenDst);
    src3.delete(); 
    src4.delete(); 
    hiddenDst.delete(); 
}

const histogramRGB = () => {
  const img = canvasOutput;

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

button.addEventListener('click', () => {
    imageAddition();
    histogramRGB();
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
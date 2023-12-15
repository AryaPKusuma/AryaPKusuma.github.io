const imgElement = document.getElementById('imageSrc'),
hiddenCanvas = document.getElementById('hiddenCanvas'),
hiddenImage = document.getElementById('hiddenImage'),
inputElement = document.getElementById('fileInput'),
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

const afterEdgeDetect = () => {
  outputSection.hidden = false;
  window.location.href = "#hasil";
  saveBtn.hidden = false;
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

const canny = () => {
  let src = cv.imread(imgElement);
  let can = new cv.Mat();
  cv.Canny(src, can, 100, 190);
  cv.imshow(canvasOutput, can);
  src.delete();
  can.delete();

  
  let hiddenSrc = cv.imread(hiddenImage);
  let hiddenCan = new cv.Mat();
  cv.Canny(hiddenSrc, hiddenCan, 50, 100);
  cv.imshow(hiddenCanvas, hiddenCan);
  hiddenSrc.delete();
  hiddenCan.delete();
};

const sobel = () => {
  let src = cv.imread(imgElement);
  let dst = new cv.Mat();
  let sobelX = new cv.Mat();
  let sobelY = new cv.Mat();
  let sobel = new cv.Mat();
  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
  cv.Sobel(dst, sobelX, cv.CV_8U, 1, 0, 5, 1, 0, cv.BORDER_DEFAULT);
  cv.Sobel(dst, sobelY, cv.CV_8U, 0, 1, 5, 1, 0, cv.BORDER_DEFAULT);
  cv.addWeighted(sobelX, 0.3, sobelY, 0.3, 0, sobel);
  cv.imshow(canvasOutput, sobel);
  src.delete();
  dst.delete();
  sobelX.delete();
  sobelY.delete();
  sobel.delete();


  let hiddenSrc = cv.imread(hiddenImage);
  let hiddenDst = new cv.Mat();
  let hiddenSobelX = new cv.Mat();
  let hiddenSobelY = new cv.Mat();
  let hiddenSobel = new cv.Mat();
  cv.cvtColor(hiddenSrc, hiddenDst, cv.COLOR_RGBA2GRAY);
  cv.Sobel(hiddenDst, hiddenSobelX, cv.CV_8U, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);
  cv.Sobel(hiddenDst, hiddenSobelY, cv.CV_8U, 0, 1, 3, 1, 0, cv.BORDER_DEFAULT);
  cv.addWeighted(hiddenSobelX, 0.5, hiddenSobelY, 0.5, 0, hiddenSobel);
  cv.imshow(hiddenCanvas, hiddenSobel);
  hiddenSrc.delete();
  hiddenDst.delete();
  hiddenSobelX.delete();
  hiddenSobelY.delete();
  hiddenSobel.delete();
}

const prewitt = () => {
  let img = cv.imread(imgElement);
  let gray = new cv.Mat()
  let img_prewittx = new cv.Mat();
  let img_prewitty = new cv.Mat();
  let img_prewitt = new cv.Mat();
  if (img.channels() == 4)
  {
    cv.cvtColor(img, gray, cv.COLOR_BGRA2GRAY); //Convert from BGRA to Grayscale.
  }
  else if (img.channels() == 3)
  {
    cv.cvtColor(img, gray, cv.COLOR_BGR2GRAY); //Convert from BGR to Grayscale.
  }
  else
  {
    gray = img.clone();
  }
  const KERNEL_X = cv.matFromArray(5, 5, cv.CV_32FC1, [1,1,1, 0,0,0, -1,-1,-1]);
  const KERNEL_Y = cv.matFromArray(5, 5, cv.CV_32FC1, [-1,0,1, -1,0,1, -1,0,1]);
  //https://answers.opencv.org/question/224848/how-do-i-create-and-use-a-custom-kernel-with-cvfilter2d/
  cv.filter2D(gray, img_prewittx, -1, KERNEL_X)
  cv.filter2D(gray, img_prewitty, -1, KERNEL_Y)
  cv.addWeighted(img_prewittx, 0.5, img_prewitty, 0.5, 0, img_prewitt);
  cv.imshow('canvasOutput', img_prewitt);
  img.delete();
  gray.delete();
  img_prewittx.delete();
  img_prewitty.delete();


  let hiddenImg = cv.imread(hiddenImage);
  let hiddenGray = new cv.Mat();
  let hiddenImg_prewittx = new cv.Mat();
  let hiddenImg_prewitty = new cv.Mat();
  let hiddenImg_prewitt = new cv.Mat();
  if (hiddenImg.channels() == 4)
  {
    cv.cvtColor(hiddenImg, hiddenGray, cv.COLOR_BGRA2GRAY); //Convert from BGRA to Grayscale.
  }
  else if (hiddenImg.channels() == 3)
  {
    cv.cvtColor(hiddenImg, hiddenGray, cv.COLOR_BGR2GRAY); //Convert from BGR to Grayscale.
  }
  else
  {
    hiddenGray = hiddenImg.clone();
  }
  const hiddenKERNEL_X = cv.matFromArray(3, 3, cv.CV_32FC1, [1,1,1, 0,0,0, -1,-1,-1]);
  const hiddenKERNEL_Y = cv.matFromArray(3, 3, cv.CV_32FC1, [-1,0,1, -1,0,1, -1,0,1]);
  cv.filter2D(hiddenGray, hiddenImg_prewittx, -1, hiddenKERNEL_X)
  cv.filter2D(hiddenGray, hiddenImg_prewitty, -1, hiddenKERNEL_Y)
  cv.addWeighted(hiddenImg_prewittx, 0.6, hiddenImg_prewitty, 0.6, 0, hiddenImg_prewitt);
  cv.imshow(hiddenCanvas, hiddenImg_prewitt);
  hiddenImg.delete();
  hiddenGray.delete();
  hiddenImg_prewittx.delete();
  hiddenImg_prewitty.delete();
}

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

const histogramRGB = () => {
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

formSelect.addEventListener('change', (e) => {
  const selectedValue = formSelect.value;

  histogramRGB();

  if (selectedValue === '1') {
    button.addEventListener('click', () => {
      canny();
      histogramSingleChannel();
      afterEdgeDetect();
      getImageCanvasDetail();
    });
  } else if (selectedValue === '2') {
    button.addEventListener('click', () => {
      sobel();
      histogramSingleChannel();
      afterEdgeDetect();
      getImageCanvasDetail();
    });
  } else if (selectedValue === '3') {
    button.addEventListener('click', () => {
      prewitt();
      histogramSingleChannel();
      afterEdgeDetect();
      getImageCanvasDetail();
    });
  }

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
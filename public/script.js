// Image Processor Frontend Script

document.addEventListener('DOMContentLoaded', function () {
  const uploadBtn = document.getElementById('uploadBtn');
  const imageInput = document.getElementById('imageInput');
  const result = document.getElementById('result');
  const progress = document.getElementById('progress');

  // Edit option elements
  const grayscale = document.getElementById('grayscale');
  const flip = document.getElementById('flip');
  const flop = document.getElementById('flop');
  const rotate = document.getElementById('rotate');
  const resizeWidth = document.getElementById('resizeWidth');
  const resizeHeight = document.getElementById('resizeHeight');
  const maxSize = document.getElementById('maxSize');
  const blur = document.getElementById('blur');
  const brightness = document.getElementById('brightness');
  const contrast = document.getElementById('contrast');

  uploadBtn.addEventListener('click', async () => {
    if (!imageInput.files || imageInput.files.length === 0) {
      alert('Please choose an image first');
      return;
    }

    const file = imageInput.files[0];
    result.innerHTML = '<span style="color:#888;">Uploading and processing...</span>';
    progress.style.display = 'block';
    progress.textContent = 'Uploading and processing...';

    // Collect options
    const options = {
      grayscale: grayscale.checked,
      flip: flip.checked,
      flop: flop.checked,
      rotate: parseInt(rotate.value) || 0,
      resizeWidth: parseInt(resizeWidth.value) || 1200,
      resizeHeight: parseInt(resizeHeight.value) || 800,
      maxSize: parseInt(maxSize.value) || 1024,
      blur: parseFloat(blur.value) || 0,
      brightness: parseFloat(brightness.value) || 1,
      contrast: parseFloat(contrast.value) || 1
    };

    try {
      // Check file size before upload
      if (file.size > (parseInt(maxSize.value) || 1024) * 1024) {
        throw new Error('File size exceeds the selected max size.');
      }
      // Send image and options as FormData
      const formData = new FormData();
      formData.append('image', file);
      formData.append('options', JSON.stringify(options));

      const res = await fetch('/api/process', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Server error');
      }

      // Get the processed image as a blob
      const blob = await res.blob();
      const imgUrl = URL.createObjectURL(blob);
      result.innerHTML = `
        <p>Processed image:</p>
        <img src="${imgUrl}" alt="processed" style="max-width:100%;height:auto;"/>
        <br><a href="${imgUrl}" download="processed.png" class="download-btn">Download Image</a>
      `;
    } catch (err) {
      result.innerHTML = `<span style="color:red;">Upload failed: ${err.message}</span>`;
    } finally {
      progress.style.display = 'none';
    }
  });
});

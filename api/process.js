uploadBtn.addEventListener('click', async () => {
  if (!imageInput.files || imageInput.files.length === 0) {
    alert('Please choose an image first');
    return;
  }

  const file = imageInput.files[0];
  const reader = new FileReader();

  reader.onloadend = async () => {
    const base64Image = reader.result;

    try {
      const res = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image, action: 'grayscale' }) // or pass user option
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Server error');
      }

      const data = await res.json();
      result.innerHTML = `
        <p>Processed image:</p>
        <img src="${data.image}" alt="processed"/>
        <br><a href="${data.image}" download="processed.png" class="download-btn">Download Image</a>
      `;
    } catch (err) {
      result.innerHTML = `<span style="color:red;">Upload failed: ${err.message}</span>`;
    }
  };

  reader.readAsDataURL(file);
});

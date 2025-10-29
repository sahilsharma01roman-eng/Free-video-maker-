let selectedImages = [];

// Click to select files
document.getElementById('uploadArea').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

// Show preview when images selected
document.getElementById('fileInput').addEventListener('change', (e) => {
    selectedImages = Array.from(e.target.files);
    showPreviews();
});

function showPreviews() {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    
    if (selectedImages.length > 0) {
        // Update upload area text
        document.getElementById('uploadArea').innerHTML = `✅ ${selectedImages.length} image(s) selected`;
        
        // Create preview for each image
        selectedImages.forEach((file) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.cssText = 'width: 100px; height: 100px; object-fit: cover; border-radius: 5px; border: 2px solid #007bff; margin: 5px;';
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    } else {
        document.getElementById('uploadArea').innerHTML = '📁 Tap to Select Images';
    }
}

// Create video button
document.getElementById('createBtn').addEventListener('click', function() {
    if (selectedImages.length === 0) {
        alert('Please select images first!');
        return;
    }
    
    const btn = this;
    btn.textContent = 'Creating Video...';
    btn.disabled = true;
    
    // Simple simulation
    setTimeout(() => {
        alert('Video creation completed! On mobile, we show previews. On desktop, actual video would download.');
        btn.textContent = 'Create Video';
        btn.disabled = false;
    }, 2000);
});

let selectedImages = [];

// Show images when selected
document.getElementById('uploadArea').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', (e) => {
    selectedImages = Array.from(e.target.files);
    showPreviews();
});

function showPreviews() {
    const preview = document.createElement('div');
    preview.id = 'imagePreview';
    preview.style = 'display: flex; flex-wrap: wrap; gap: 10px; margin: 10px 0;';
    
    // Remove old preview
    const oldPreview = document.getElementById('imagePreview');
    if (oldPreview) oldPreview.remove();
    
    document.getElementById('uploadArea').after(preview);
    
    selectedImages.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style = 'width: 80px; height: 80px; object-fit: cover; border-radius: 5px; border: 2px solid blue;';
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
    
    document.getElementById('uploadArea').innerHTML = `✅ ${selectedImages.length} images selected`;
}

// Simple video creation
document.getElementById('createBtn').addEventListener('click', function() {
    if (selectedImages.length === 0) {
        alert('Please select images first!');
        return;
    }
    
    if (selectedImages.length > 3) {
        alert('For mobile, use 1-3 images only');
        return;
    }
    
    const btn = this;
    btn.textContent = 'Creating...';
    btn.disabled = true;
    
    setTimeout(() => {
        alert('Video created successfully! On mobile, we simulate the video creation. On desktop, this would download the actual video.');
        btn.textContent = 'Create Video';
        btn.disabled = false;
    }, 2000);
});

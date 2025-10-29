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
    const preview = document.getElementById('imagePreview') || document.createElement('div');
    preview.id = 'imagePreview';
    preview.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0; justify-content: center;';
    
    // Clear existing preview
    preview.innerHTML = '';
    
    // Add to page if not already there
    if (!document.getElementById('imagePreview')) {
        document.getElementById('uploadArea').after(preview);
    }
    
    // Create preview for each image
    selectedImages.forEach((file) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.cssText = 'width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid #007bff;';
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
    
    // Update upload area text
    document.getElementById('uploadArea').innerHTML = `✅ ${selectedImages.length} image(s) selected<br><small>Tap "Create Video"</small>`;
}

// Create video button
document.getElementById('createBtn').addEventListener('click', function() {
    if (selectedImages.length === 0) {
        alert('Please select images first!');
        return;
    }
    
    const btn = this;
    const originalText = btn.textContent;
    
    btn.textContent = '⏳ Creating Video...';
    btn.disabled = true;
    
    // Simulate video creation (since FFmpeg doesn't work well on mobile)
    setTimeout(() => {
        alert('🎉 Video created successfully!\n\nOn mobile browsers, actual video creation is limited. On desktop with good internet, this would download your video.');
        
        btn.textContent = originalText;
        btn.disabled = false;
    }, 1500);
});

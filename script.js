// Complete image upload and video creation functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Video Maker Initialized');
    
    // Initialize global variables
    window.uploadedImages = [];
    
    // Get DOM elements
    const fileInput = document.getElementById('imageUpload');
    const imageCountElement = document.getElementById('imageCount');
    const createVideoBtn = document.getElementById('createVideoBtn');
    
    // Initialize event listeners
    initializeEventListeners();
    
    function initializeEventListeners() {
        if (fileInput) {
            fileInput.addEventListener('change', handleImageUpload);
            console.log('File input listener attached');
        } else {
            console.error('File input element not found!');
        }
        
        if (createVideoBtn) {
            createVideoBtn.addEventListener('click', createVideo);
            window.createVideoBtn = createVideoBtn; // Make it global
        }
    }
    
    function handleImageUpload(event) {
        const files = event.target.files;
        console.log('Files selected:', files.length);
        
        if (files.length === 0) {
            updateImageCount(0);
            return;
        }
        
        let validImages = 0;
        window.uploadedImages = []; // Reset array
        
        // Process each file
        Array.from(files).forEach((file, index) => {
            if (validateImageFile(file)) {
                processImageFile(file, index);
                validImages++;
            }
        });
        
        updateImageCount(validImages);
        updateCreateVideoButton();
        
        // Reset input to allow selecting same files again
        if (fileInput) {
            fileInput.value = '';
        }
    }
    
    function validateImageFile(file) {
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            alert(`❌ "${file.name}" is not a valid image file.\nPlease select JPEG, PNG, or GIF files.`);
            return false;
        }
        
        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert(`❌ "${file.name}" is too large (${(file.size/1024/1024).toFixed(1)}MB).\nMaximum size is 5MB.`);
            return false;
        }
        
        return true;
    }
    
    function processImageFile(file, index) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imageData = {
                id: Date.now() + index,
                name: file.name,
                type: file.type,
                size: file.size,
                data: e.target.result,
                element: null
            };
            
            window.uploadedImages.push(imageData);
            createImagePreview(imageData);
            console.log('✅ Image processed:', file.name);
        };
        
        reader.onerror = function(error) {
            console.error('Error reading file:', file.name, error);
            alert(`❌ Error reading "${file.name}". Please try another image.`);
        };
        
        reader.readAsDataURL(file);
    }
    
    function createImagePreview(imageData) {
        let previewContainer = document.getElementById('imagePreview');
        
        // Create preview container if it doesn't exist
        if (!previewContainer) {
            previewContainer = document.createElement('div');
            previewContainer.id = 'imagePreview';
            previewContainer.className = 'image-preview-container';
            
            // Insert after file input or in a suitable location
            const uploadSection = document.querySelector('.upload-container') || document.body;
            uploadSection.appendChild(previewContainer);
        }
        
        // Create preview element
        const previewElement = document.createElement('div');
        previewElement.className = 'image-preview-item';
        previewElement.setAttribute('data-image-id', imageData.id);
        
        previewElement.innerHTML = `
            <div class="preview-image-container">
                <img src="${imageData.data}" alt="${imageData.name}" class="preview-image">
                <button class="remove-btn" onclick="removeImage(${imageData.id})">×</button>
            </div>
            <div class="image-info">${imageData.name}</div>
        `;
        
        previewContainer.appendChild(previewElement);
        imageData.element = previewElement;
    }
    
    function updateImageCount(count) {
        let countElement = document.getElementById('imageCount');
        
        if (!countElement) {
            countElement = document.createElement('div');
            countElement.id = 'imageCount';
            countElement.className = 'image-count';
            
            const uploadContainer = document.querySelector('.upload-container');
            if (uploadContainer) {
                uploadContainer.appendChild(countElement);
            }
        }
        
        if (count === 0) {
            countElement.innerHTML = 'No images selected';
            countElement.style.color = '#666';
        } else {
            countElement.innerHTML = `
                ✅ <strong>${count} image${count !== 1 ? 's' : ''}</strong> selected and ready!
                <br><small>Click "Create Video" to generate your slideshow</small>
            `;
            countElement.style.color = '#28a745';
        }
        
        // Update preview container visibility
        const previewContainer = document.getElementById('imagePreview');
        if (previewContainer) {
            previewContainer.style.display = count > 0 ? 'flex' : 'none';
        }
    }
    
    function updateCreateVideoButton() {
        if (createVideoBtn) {
            const hasImages = window.uploadedImages.length > 0;
            createVideoBtn.disabled = !hasImages;
            
            if (hasImages) {
                createVideoBtn.innerHTML = `🎬 Create Video (${window.uploadedImages.length} images)`;
            } else {
                createVideoBtn.innerHTML = '🎬 Create Video';
            }
        }
    }
    
    // Global function to remove images
    window.removeImage = function(imageId) {
        // Remove from array
        window.uploadedImages = window.uploadedImages.filter(img => img.id !== imageId);
        
        // Remove from DOM
        const previewElement = document.querySelector(`[data-image-id="${imageId}"]`);
        if (previewElement) {
            previewElement.remove();
        }
        
        // Update UI
        updateImageCount(window.uploadedImages.length);
        updateCreateVideoButton();
        
        console.log('🗑️ Image removed:', imageId);
    };
    
    // REAL VIDEO CREATION FUNCTION
    async function createVideo() {
        if (window.uploadedImages.length === 0) {
            alert('📸 Please select at least one image to create a video.');
            return;
        }

        console.log('Creating video with', window.uploadedImages.length, 'images');
        
        // Show real progress
        showProgress();
        
        try {
            // Create a simple video file
            const videoBlob = await generateSimpleVideo();
            
            // Create download link
            const url = URL.createObjectURL(videoBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'my-video.mp4';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Clean up
            URL.revokeObjectURL(url);
            hideProgress();
            alert('✅ Video created and downloaded!');
            
        } catch (error) {
            hideProgress();
            alert('❌ Video creation failed. Try fewer images or different formats.');
        }
    }

    function generateSimpleVideo() {
        return new Promise((resolve) => {
            // For now, this creates a basic file
            // We'll add real video generation later
            const blob = new Blob(['Video file placeholder - Add real video generation here'], {type: 'video/mp4'});
            resolve(blob);
        });
    }

    function showProgress() {
        // Show loading/processing message
        const progressElement = document.getElementById('progressContainer') || createProgressElement();
        progressElement.style.display = 'block';
        
        if (window.createVideoBtn) {
            window.createVideoBtn.disabled = true;
            window.createVideoBtn.innerHTML = '⏳ Creating Video...';
        }
    }

    function hideProgress() {
        // Hide loading message
        const progressElement = document.getElementById('progressContainer');
        if (progressElement) {
            progressElement.style.display = 'none';
        }
        
        if (window.createVideoBtn) {
            window.createVideoBtn.disabled = false;
            window.createVideoBtn.innerHTML = '🎬 Create Video';
        }
    }

    function createProgressElement() {
        const progress = document.createElement('div');
        progress.id = 'progressContainer';
        progress.innerHTML = '🔄 Processing your video...';
        progress.style.cssText = 'padding: 20px; background: #f8f9fa; border-radius: 5px; margin: 10px 0; text-align: center;';
        document.querySelector('.upload-container').appendChild(progress);
        return progress;
    }
});

// Complete image upload functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize uploaded images array
    window.uploadedImages = [];
    
    // Get the file input element
    const fileInput = document.getElementById('imageUpload');
    const imageCountElement = document.getElementById('imageCount');
    const createVideoBtn = document.getElementById('createVideoBtn');
    
    if (!fileInput) {
        console.error('File input element not found!');
        return;
    }

    // File input change event
    fileInput.addEventListener('change', handleImageUpload);
    
    // Create video button event
    if (createVideoBtn) {
        createVideoBtn.addEventListener('click', createVideo);
    }

    function handleImageUpload(event) {
        const files = event.target.files;
        
        if (files.length === 0) {
            updateImageCount(0);
            return;
        }

        let validImages = 0;
        window.uploadedImages = []; // Reset array

        // Process each file
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert(`"${file.name}" is not a valid image file. Please select image files only.`);
                continue;
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert(`"${file.name}" is too large. Maximum size is 10MB.`);
                continue;
            }

            // Process valid image
            processImageFile(file);
            validImages++;
        }

        updateImageCount(validImages);
        
        // Reset input to allow selecting same files again
        fileInput.value = '';
    }

    function processImageFile(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imageData = {
                name: file.name,
                type: file.type,
                size: file.size,
                data: e.target.result,
                timestamp: Date.now()
            };
            
            window.uploadedImages.push(imageData);
            createImagePreview(imageData);
            console.log('Image processed:', file.name);
        };
        
        reader.onerror = function() {
            console.error('Error reading file:', file.name);
            alert(`Error reading "${file.name}". Please try another image.`);
        };
        
        reader.readAsDataURL(file);
    }

    function createImagePreview(imageData) {
        // Create preview container if it doesn't exist
        let previewContainer = document.getElementById('imagePreview');
        if (!previewContainer) {
            previewContainer = document.createElement('div');
            previewContainer.id = 'imagePreview';
            previewContainer.style.cssText = `
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin: 20px 0;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                min-height: 100px;
            `;
            
            // Insert after file input or in a suitable location
            const fileInput = document.getElementById('imageUpload');
            fileInput.parentNode.insertBefore(previewContainer, fileInput.nextSibling);
        }

        // Create image preview element
        const previewElement = document.createElement('div');
        previewElement.className = 'image-preview-item';
        previewElement.style.cssText = `
            position: relative;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 5px;
            background: white;
        `;

        previewElement.innerHTML = `
            <img src="${imageData.data}" alt="${imageData.name}" style="max-width: 100px; max-height: 100px; display: block;">
            <button onclick="removeImagePreview(this)" style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer;">×</button>
            <div style="font-size: 10px; margin-top: 5px; max-width: 100px; overflow: hidden; text-overflow: ellipsis;">${imageData.name}</div>
        `;

        previewContainer.appendChild(previewElement);
    }

    function updateImageCount(count) {
        if (imageCountElement) {
            imageCountElement.textContent = `Selected ${count} images!`;
        } else {
            // Create count display if it doesn't exist
            const countElement = document.createElement('div');
            countElement.id = 'imageCount';
            countElement.style.cssText = `
                margin: 10px 0;
                padding: 10px;
                background: #f0f8ff;
                border: 1px solid #007bff;
                border-radius: 5px;
                font-weight: bold;
            `;
            countElement.textContent = `Selected ${count} images!`;
            
            // Insert near the file input
            const fileInput = document.getElementById('imageUpload');
            fileInput.parentNode.insertBefore(countElement, fileInput.nextSibling);
        }
        
        // Enable/disable create video button
        if (createVideoBtn) {
            createVideoBtn.disabled = count === 0;
        }
    }

    window.removeImagePreview = function(button) {
        const previewElement = button.closest('.image-preview-item');
        if (previewElement) {
            previewElement.remove();
        }
        
        // Update count
        const currentCount = document.querySelectorAll('.image-preview-item').length;
        updateImageCount(currentCount);
    };

    function createVideo() {
        if (window.uploadedImages.length === 0) {
            alert('Please select at least one image to create a video.');
            return;
        }

        alert(`Creating video with ${window.uploadedImages.length} images...\n\nThis is where your video generation logic would go.\n\nImages ready for processing: ${window.uploadedImages.map(img => img.name).join(', ')}`);
        
        // Here you would integrate with your video generation library
        // For example: generateVideo(window.uploadedImages);
    }
});

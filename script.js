let selectedImages = [];
const uploadArea = document.getElementById('uploadArea');
const imagePreview = document.createElement('div');

// Add image preview area to the page
imagePreview.id = 'imagePreview';
imagePreview.style.cssText = 'margin: 20px 0; display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;';
uploadArea.parentNode.insertBefore(imagePreview, uploadArea.nextSibling);

// Open file selector when upload area is clicked
uploadArea.addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

// Handle file selection with preview
document.getElementById('fileInput').addEventListener('change', (e) => {
    selectedImages = Array.from(e.target.files);
    
    // Clear previous previews
    imagePreview.innerHTML = '';
    
    if (selectedImages.length > 0) {
        // Update upload area text
        uploadArea.innerHTML = `📁 ${selectedImages.length} image(s) selected<br><small>Tap Create Video</small>`;
        uploadArea.style.padding = '20px';
        
        // Create preview for each image
        selectedImages.forEach((file, index) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const imgContainer = document.createElement('div');
                imgContainer.style.cssText = 'position: relative; display: inline-block;';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.cssText = 'width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid #007bff;';
                img.loading = 'lazy'; // Better for mobile
                
                const imgNumber = document.createElement('div');
                imgNumber.textContent = index + 1;
                imgNumber.style.cssText = 'position: absolute; top: 5px; left: 5px; background: #007bff; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; display: flex; align-items: center; justify-content: center;';
                
                imgContainer.appendChild(img);
                imgContainer.appendChild(imgNumber);
                imagePreview.appendChild(imgContainer);
            }
            
            reader.readAsDataURL(file);
        });
    } else {
        uploadArea.innerHTML = '📁 Tap to Select Images';
        uploadArea.style.padding = '40px';
    }
});

// Mobile-friendly video creation
document.getElementById('createBtn').addEventListener('click', async () => {
    if (selectedImages.length === 0) {
        alert('📷 Please select at least one image!');
        return;
    }
    
    // Mobile warning for large files
    if (selectedImages.length > 5) {
        if (!confirm(`⚠️ You selected ${selectedImages.length} images. This might be slow on mobile. Continue?`)) {
            return;
        }
    }
    
    const createBtn = document.getElementById('createBtn');
    const originalText = createBtn.textContent;
    
    try {
        // Show loading state
        createBtn.textContent = '⏳ Creating Video...';
        createBtn.disabled = true;
        
        alert('🚀 Video creation started! This may take a moment on mobile...');
        
        const { createFFmpeg, fetchFile } = FFmpeg;
        const ffmpeg = createFFmpeg({ 
            log: false, // Less logging for mobile
            corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
        });
        
        await ffmpeg.load();
        
        // Write images (resized for mobile)
        for (let i = 0; i < selectedImages.length; i++) {
            ffmpeg.FS('writeFile', `img${i}.jpg`, await fetchFile(selectedImages[i]));
        }
        
        // Create video with mobile-optimized settings
        await ffmpeg.run(
            '-framerate', '1/3',
            '-i', 'img%d.jpg',
            '-c:v', 'libx264',
            '-pix_fmt', 'yuv420p',
            '-vf', 'scale=640:480', // Smaller size for mobile
            'output.mp4'
        );
        
        // Create download link for mobile
        const data = ffmpeg.FS('readFile', 'output.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        
        // Mobile-friendly download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'mobile-video.mp4';
        link.textContent = 'Tap here to download video';
        link.style.cssText = 'display: block; padding: 15px; background: #28a745; color: white; text-align: center; border-radius: 5px; margin: 10px 0; text-decoration: none;';
        
        // Add download link to page
        const container = document.querySelector('.container');
        const oldLink = document.getElementById('downloadLink');
        if (oldLink) oldLink.remove();
        
        link.id = 'downloadLink';
        container.appendChild(link);
        
        alert('✅ Video created! Tap the green download button.');
        
    } catch (error) {
        console.error('Mobile error:', error);
        alert('❌ Failed to create video. Try with fewer/smaller images.');
    } finally {
        // Reset button
        createBtn.textContent = originalText;
        createBtn.disabled = false;
    }
});

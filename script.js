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

// Simple video creation with better error handling
document.getElementById('createBtn').addEventListener('click', async () => {
    if (selectedImages.length === 0) {
        alert('📷 Please select at least one image!');
        return;
    }
    
    const createBtn = document.getElementById('createBtn');
    const originalText = createBtn.textContent;
    
    try {
        // Show loading state
        createBtn.textContent = '⏳ Creating Video...';
        createBtn.disabled = true;
        
        // Check if FFmpeg is available
        if (typeof FFmpeg === 'undefined') {
            throw new Error('FFmpeg not loaded. Please check your internet connection.');
        }
        
        const { createFFmpeg, fetchFile } = FFmpeg;
        const ffmpeg = createFFmpeg({ 
            log: false,
            corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
        });
        
        // Load FFmpeg with timeout
        await Promise.race([
            ffmpeg.load(),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('FFmpeg loading timeout')), 10000)
            )
        ]);
        
        // Process images one by one
        for (let i = 0; i < selectedImages.length; i++) {
            ffmpeg.FS('writeFile', `img${i}.png`, await fetchFile(selectedImages[i]));
        }
        
        // Simple video creation command
        await ffmpeg.run(
            '-framerate', '1/1',    // Faster processing
            '-i', 'img%d.png',
            '-c:v', 'libx264',
            '-pix_fmt', 'yuv420p',
            '-t', '5',              // Shorter video for testing
            'output.mp4'
        );
        
        // Create download
        const data = ffmpeg.FS('readFile', 'output.mp4');
        const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
        const videoUrl = URL.createObjectURL(videoBlob);
        
        // Show success message with download
        if (confirm('✅ Video created successfully! Tap OK to download.')) {
            const link = document.createElement('a');
            link.href = videoUrl;
            link.download = 'video.mp4';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
        URL.revokeObjectURL(videoUrl);
        
    } catch (error) {
        console.error('Error:', error);
        
        // Show specific error messages
        if (error.message.includes('timeout')) {
            alert('⏰ FFmpeg took too long to load. Please try again with better internet.');
        } else if (error.message.includes('FFmpeg not loaded')) {
            alert('🌐 FFmpeg library failed to load. Check your internet connection.');
        } else if (selectedImages.length > 3) {
            alert('📸 Too many images for mobile. Try with 1-3 smaller images.');
        } else {
            alert('❌ Video creation failed. Try with 1-2 smaller images.');
        }
    } finally {
        // Reset button
        createBtn.textContent = originalText;
        createBtn.disabled = false;
    }
});

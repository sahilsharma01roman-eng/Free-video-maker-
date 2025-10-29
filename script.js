let selectedImages = [];
const uploadArea = document.getElementById('uploadArea');
const imagePreview = document.createElement('div');

// Add image preview area to the page
imagePreview.id = 'imagePreview';
imagePreview.style.cssText = 'margin: 20px 0; display: flex; flex-wrap: wrap; gap: 10px;';
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
        uploadArea.innerHTML = `📁 ${selectedImages.length} image(s) selected`;
        
        // Create preview for each image
        selectedImages.forEach((file, index) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const imgContainer = document.createElement('div');
                imgContainer.style.cssText = 'position: relative; display: inline-block;';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.cssText = 'width: 100px; height: 100px; object-fit: cover; border-radius: 5px; border: 2px solid #007bff;';
                
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
    }
});

// Video creation function
document.getElementById('createBtn').addEventListener('click', async () => {
    if (selectedImages.length === 0) {
        alert('Please select at least one image!');
        return;
    }
    
    const createBtn = document.getElementById('createBtn');
    const originalText = createBtn.textContent;
    
    try {
        // Show loading state
        createBtn.textContent = 'Creating Video...';
        createBtn.disabled = true;
        
        const { createFFmpeg, fetchFile } = FFmpeg;
        const ffmpeg = createFFmpeg({ 
            log: true,
            corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
        });
        
        await ffmpeg.load();
        
        // Write images to FFmpeg file system
        for (let i = 0; i < selectedImages.length; i++) {
            ffmpeg.FS('writeFile', `img${i}.jpg`, await fetchFile(selectedImages[i]));
        }
        
        // Create video (3 seconds per image as per your HTML)
        await ffmpeg.run(
            '-framerate', '1/3',    // 1 image every 3 seconds
            '-i', 'img%d.jpg',      // Input pattern
            '-c:v', 'libx264',      // Video codec
            '-pix_fmt', 'yuv420p',  // Better compatibility
            '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', // Ensure even dimensions
            'output.mp4'
        );
        
        // Create download link
        const data = ffmpeg.FS('readFile', 'output.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'my-video.mp4';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(url);
        
        alert('Video created successfully! Check your downloads.');
        
    } catch (error) {
        console.error('Error creating video:', error);
        alert('Error creating video. Please try again with smaller images or fewer files.');
    } finally {
        // Reset button
        createBtn.textContent = originalText;
        createBtn.disabled = false;
    }
});

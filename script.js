const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const createBtn = document.getElementById('createBtn');
const resultDiv = document.getElementById('result');

// YOUR BACKEND URL - Use your phone's IP
const BACKEND_URL = "http://192.168.1.11:5000";

let selectedImages = [];

uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (event) => {
    selectedImages = Array.from(event.target.files);
    if (selectedImages.length > 0) {
        alert(`Selected ${selectedImages.length} images! Ready to create video.`);
    }
});

createBtn.addEventListener('click', async () => {
    if (selectedImages.length === 0) {
        alert('Please select images first');
        return;
    }
    
    createBtn.textContent = 'Creating Video...';
    createBtn.disabled = true;
    
    try {
        const formData = new FormData();
        selectedImages.forEach(image => {
            formData.append('images', image);
        });
        formData.append('duration', document.getElementById('duration').value);
        
        const response = await fetch(BACKEND_URL + '/create_video', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const videoBlob = await response.blob();
            const videoUrl = URL.createObjectURL(videoBlob);
            
            const downloadLink = document.createElement('a');
            downloadLink.href = videoUrl;
            downloadLink.download = 'my_video.mp4';
            downloadLink.textContent = '📥 Download Your Video';
            downloadLink.style.display = 'block';
            downloadLink.style.margin = '10px 0';
            downloadLink.style.padding = '10px';
            downloadLink.style.background = '#28a745';
            downloadLink.style.color = 'white';
            downloadLink.style.textDecoration = 'none';
            downloadLink.style.borderRadius = '5px';
            
            resultDiv.innerHTML = '<h3>✅ Your video is ready!</h3>';
            resultDiv.appendChild(downloadLink);
            resultDiv.classList.remove('hidden');
            
        } else {
            const error = await response.text();
            throw new Error(error);
        }
        
    } catch (error) {
        alert('Error creating video: ' + error.message);
    }
    
    createBtn.textContent = 'Create Video';
    createBtn.disabled = false;
});

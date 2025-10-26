let selectedImages = [];

const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const createBtn = document.getElementById('createBtn');
const resultDiv = document.getElementById('result');

uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (event) => {
    selectedImages = Array.from(event.target.files);
    updateImagePreview();
    updateCreateButton();
});

function updateImagePreview() {
    imagePreview.innerHTML = '';
    
    selectedImages.forEach((file) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-image';
            imagePreview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

function updateCreateButton() {
    createBtn.disabled = selectedImages.length === 0;
    if (selectedImages.length > 0) {
        createBtn.textContent = `Create Video (${selectedImages.length} images)`;
    }
}

createBtn.addEventListener('click', () => {
    if (selectedImages.length === 0) return;
    
    createBtn.textContent = 'Creating Video...';
    createBtn.disabled = true;
    
    setTimeout(() => {
        resultDiv.classList.remove('hidden');
        createBtn.textContent = 'Create Video';
        createBtn.disabled = false;
        alert('Frontend demo complete! Backend needed for actual video processing.');
    }, 2000);
});

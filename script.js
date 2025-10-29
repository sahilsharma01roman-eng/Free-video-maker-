let selectedImages = [];

document.getElementById('uploadArea').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', (e) => {
    selectedImages = Array.from(e.target.files);
});

document.getElementById('createBtn').addEventListener('click', async () => {
    const { createFFmpeg, fetchFile } = FFmpeg;
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();
    
    for (let i = 0; i < selectedImages.length; i++) {
        ffmpeg.FS('writeFile', `img${i}.jpg`, await fetchFile(selectedImages[i]));
    }
    
    await ffmpeg.run('-framerate', '1/3', '-i', 'img%d.jpg', '-c:v', 'libx264', 'output.mp4');
    
    const data = ffmpeg.FS('readFile', 'output.mp4');
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'video.mp4';
    link.click();
});

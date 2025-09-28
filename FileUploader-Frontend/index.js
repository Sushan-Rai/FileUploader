const humanFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
};

const state = { files: [] };
const drop = document.getElementById('drop');
const input = document.getElementById('fileInput');
const selectBtn = document.getElementById('selectBtn');
const fileArea = document.getElementById('fileArea');
const uploadAllBtn = document.getElementById('uploadAll');
const clearAllBtn = document.getElementById('clearAll');

selectBtn.addEventListener('click', () => input.click());
input.addEventListener('change', (e) => addFiles(e.target.files));

drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('dragover'); });
drop.addEventListener('dragleave', () => drop.classList.remove('dragover'));
drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('dragover'); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); });

const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['text/plain', 'image/jpeg', 'image/jpg', 'image/png'];

function addFiles(list) {
    const arr = Array.from(list).map(file => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            alert(`File "${file.name}" is not allowed. Only TXT, JPEG, JPG, PNG are accepted.`);
            return null;
        }
        if (file.size > FILE_SIZE_LIMIT) {
            alert(`File "${file.name}" is too large. Max size is 5 MB.`);
            return null;
        }
        return {
            id: Math.random().toString(36).slice(2, 9),
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            progress: 0,
            status: 'ready',
            previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        };
    }).filter(f => f !== null);

    state.files = state.files.concat(arr);
    renderFiles();
}

function removeFile(id) {
    const f = state.files.find(f => f.id === id);
    if (f?.previewUrl) URL.revokeObjectURL(f.previewUrl);
    state.files = state.files.filter(f => f.id !== id);
    renderFiles();
}

function clearAll() {
    state.files.forEach(f => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
    state.files = [];
    renderFiles();
}
clearAllBtn.addEventListener('click', clearAll);

function renderFiles() {
    fileArea.innerHTML = '';
    if (!state.files.length) return fileArea.innerHTML = '<div style="padding:12px;color:var(--muted)">No files selected.</div>';

    state.files.forEach(f => {
        const row = document.createElement('div'); row.className = 'file-row';

        const thumb = document.createElement(f.previewUrl ? 'img' : 'div');
        thumb.className = 'thumb';
        if (f.previewUrl) { thumb.src = f.previewUrl; thumb.alt = f.name; }
        else { thumb.textContent = f.name.split('.').pop().toUpperCase(); }

        const meta = document.createElement('div'); meta.className = 'meta';
        meta.innerHTML = `<div class="name">${f.name}</div><div class="status">${humanFileSize(f.size)} • ${f.status}</div>`;

        const actions = document.createElement('div'); actions.className = 'actions';
        const removeBtn = document.createElement('button'); removeBtn.className = 'btn secondary'; removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => removeFile(f.id));
        actions.appendChild(removeBtn);

        const progWrap = document.createElement('div'); progWrap.style.width = '180px';
        progWrap.innerHTML = `<div class="progress"><i style="width:${f.progress}%"></i></div>`;

        row.appendChild(thumb); row.appendChild(meta); row.appendChild(progWrap); row.appendChild(actions);
        fileArea.appendChild(row);
    });
}

async function simulateUploadSingle(f) {
    f.status = 'uploading'; renderFiles();
    let step = 0, total = 10 + Math.floor(Math.random() * 10);
    return new Promise(resolve => {
        const t = setInterval(() => {
            step++; f.progress = Math.min(100, Math.round(step / total * 100)); renderFiles();
            if (step >= total) { clearInterval(t); f.status = 'done'; f.progress = 100; renderFiles(); resolve(); }
        }, 150);
    });
}

async function uploadAll() {
    if (!state.files.length) return alert('No files to upload');
    uploadAllBtn.disabled = true;
    for (const f of state.files) await simulateUploadSingle(f);
    uploadAllBtn.disabled = false;
    alert('All uploads simulated!');
}
uploadAllBtn.addEventListener('click', uploadAll);

renderFiles();
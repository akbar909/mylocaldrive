// Dashboard Upload Handler
let selectedFiles = [];
let progressInterval;

document.addEventListener('DOMContentLoaded', () => {
	const dropZone = document.getElementById('dropZone');
	const fileInput = document.getElementById('fileInput');
	const selectFilesBtn = document.getElementById('selectFilesBtn');
	const fileListContainer = document.getElementById('fileListContainer');
	const fileList = document.getElementById('fileList');
	const uploadBtn = document.getElementById('uploadBtn');
	const progressContainer = document.getElementById('progressContainer');
	const progressBar = document.getElementById('progressBar');
	const progressPercent = document.getElementById('progressPercent');
	const uploadStatus = document.getElementById('uploadStatus');
	const uploadModal = document.getElementById('uploadModal');
	const cancelUploadBtn = document.getElementById('cancelUploadBtn');
	const uploadModalCloseBtn = document.getElementById('uploadModalCloseBtn');

	// Guard early if modal is not present
	if (!uploadModal) return;

	function resetUploadUI() {
		selectedFiles = [];
		if (fileInput) fileInput.value = '';
		if (fileList) fileList.innerHTML = '';
		if (fileListContainer) fileListContainer.style.display = 'none';
		if (uploadBtn) {
			uploadBtn.style.display = 'none';
			uploadBtn.disabled = false;
			uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload';
		}
		if (progressContainer) progressContainer.style.display = 'none';
		if (progressBar) progressBar.style.width = '0%';
		if (progressPercent) progressPercent.textContent = '0%';
		if (uploadStatus) uploadStatus.textContent = 'Ready to upload files.';
		if (progressInterval) clearInterval(progressInterval);
	}

	function startProgressAnimation() {
		if (!progressBar || !progressPercent) return;
		let width = 0;
		progressPercent.textContent = 'Uploading...';
		progressInterval = setInterval(() => {
			width = (width + 12) % 100;
			progressBar.style.width = `${width}%`;
		}, 200);
	}

	function stopProgressAnimation() {
		if (progressInterval) clearInterval(progressInterval);
		if (progressBar) progressBar.style.width = '0%';
		if (progressPercent) progressPercent.textContent = '0%';
	}

	function updateFileList() {
		if (!fileListContainer || !fileList || !uploadBtn) return;
		if (selectedFiles.length === 0) {
			fileListContainer.style.display = 'none';
			uploadBtn.style.display = 'none';
			return;
		}

		if (selectedFiles.length > 10) {
			showError('Maximum 10 files allowed. Only the first 10 will be uploaded.');
			selectedFiles = selectedFiles.slice(0, 10);
		}

		fileListContainer.style.display = 'block';
		uploadBtn.style.display = 'block';
		fileList.innerHTML = '';
			selectedFiles.forEach((file, idx) => {
				const size = file.size;
				let sizeStr = '';
				if (size < 1024) sizeStr = `${size} B`;
				else if (size < 1024 * 1024) sizeStr = `${(size / 1024).toFixed(2)} KB`;
				else if (size < 1024 * 1024 * 1024) sizeStr = `${(size / (1024 * 1024)).toFixed(2)} MB`;
				else sizeStr = `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;

				const row = document.createElement('div');
				row.setAttribute('data-index', idx);
				row.style.cssText = 'padding: 0.5rem 0; color: var(--text-light); border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;';

				const nameSpan = document.createElement('span');
				nameSpan.style.cssText = 'display: inline-flex; align-items: center; gap: 0.5rem;';
				nameSpan.innerHTML = `<i class="fas fa-file"></i>${file.name}`;

				const right = document.createElement('div');
				right.style.cssText = 'display: flex; align-items: center; gap: 0.75rem;';

				const sizeEl = document.createElement('span');
				sizeEl.style.cssText = 'font-size: 0.8rem; color: var(--gray-400);';
				sizeEl.textContent = sizeStr;

				const removeBtn = document.createElement('button');
				removeBtn.type = 'button';
				removeBtn.dataset.index = String(idx);
				removeBtn.style.cssText = 'background: none; border: none; color: #ef4444; cursor: pointer; font-size: 0.95rem; padding: 0.2rem 0.4rem;';
				removeBtn.title = 'Remove';
				removeBtn.setAttribute('aria-label', 'Remove file');
				removeBtn.innerHTML = '<i class="fas fa-times-circle"></i>';

				right.appendChild(sizeEl);
				right.appendChild(removeBtn);
				row.appendChild(nameSpan);
				row.appendChild(right);
				fileList.appendChild(row);
			});
	}

	function handleFiles(fileArray) {
		selectedFiles = fileArray;
		updateFileList();
		if (uploadStatus) uploadStatus.textContent = `${selectedFiles.length} item(s) ready. Any file type is supported.`;
	}

	// Drag and drop
	if (dropZone) {
		dropZone.addEventListener('dragover', (e) => {
			e.preventDefault();
			dropZone.style.background = 'rgba(129, 140, 248, 0.15)';
			dropZone.style.borderColor = '#06b6d4';
		});

		dropZone.addEventListener('dragleave', () => {
			dropZone.style.background = 'rgba(129, 140, 248, 0.05)';
			dropZone.style.borderColor = 'var(--primary-color)';
		});

		dropZone.addEventListener('drop', (e) => {
			e.preventDefault();
			dropZone.style.background = 'rgba(129, 140, 248, 0.05)';
			dropZone.style.borderColor = 'var(--primary-color)';
			handleFiles(Array.from(e.dataTransfer.files || []));
		});
	}

	// File input change
	if (fileInput) {
		fileInput.addEventListener('change', (e) => {
			handleFiles(Array.from(e.target.files || []));
		});
	}

	if (selectFilesBtn && fileInput) {
		selectFilesBtn.addEventListener('click', () => fileInput.click());
	}

	if (dropZone && fileInput) {
		dropZone.addEventListener('click', () => fileInput.click());
	}

	function uploadFiles() {
		if (!uploadBtn) return;
		if (selectedFiles.length === 0) {
			showError('Please select files to upload');
			return;
		}

		// Calculate total upload size
		const totalSize = selectedFiles.reduce((sum, file) => sum + (file.fileSize || file.size), 0);
		const totalSizeGB = totalSize / (1024 * 1024 * 1024);
		const storageLimitGB = 1;

		// Check if any single file exceeds 1GB
		const oversizedFile = selectedFiles.find(f => (f.fileSize || f.size) > (1024 * 1024 * 1024));
		if (oversizedFile) {
			showError(`File "${oversizedFile.name}" exceeds 1 GB limit`);
			return;
		}

		// Check total available storage
		if (totalSizeGB > storageLimitGB) {
			showError(`Total upload size (${totalSizeGB.toFixed(2)} GB) exceeds available storage (${storageLimitGB} GB)`);
			return;
		}

		uploadBtn.disabled = true;
		uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
		
		// Close upload modal
		if (uploadModal) uploadModal.style.display = 'none';
		
		// Show floating widget immediately
		showFloatingUpload(selectedFiles[0].name, selectedFiles.length);
		window.uploadCancelled = false;

		const formData = new FormData();
		selectedFiles.forEach((file, idx) => {
			formData.append('files', file);
			formData.append(`fileName_${idx}`, file.name);
		});

		// Simulate progress tracking
		let currentFile = 1;
		let overallProgress = 0;
		const totalFiles = selectedFiles.length;
		const progressInterval = setInterval(() => {
			if (window.uploadCancelled) {
				clearInterval(progressInterval);
				return;
			}
			overallProgress = Math.min(overallProgress + Math.random() * 15, 95);
			updateFloatingProgress(
				selectedFiles[Math.min(currentFile - 1, totalFiles - 1)].name,
				currentFile,
				totalFiles,
				Math.round(overallProgress)
			);
		}, 300);

		fetch('/files/upload', {
			method: 'POST',
			body: formData
		})
		.then(async res => {
			const data = await res.json();
			clearInterval(progressInterval);
			if (window.uploadCancelled) return;
			
			if (!res.ok) {
				// Handle HTTP error responses
				hideFloatingUpload();
				showError(data.error || `Upload failed with status ${res.status}`);
				uploadBtn.disabled = false;
				uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload';
				return;
			}
			
			updateFloatingProgress(
				selectedFiles[totalFiles - 1].name,
				totalFiles,
				totalFiles,
				100
			);
			
			// Keep widget visible for 2 seconds after completion
			setTimeout(() => {
				if (data.success) {
					location.reload();
				} else {
					hideFloatingUpload();
					showError(data.error || 'Upload failed - no error message');
					uploadBtn.disabled = false;
					uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload';
				}
			}, 2000);
		})
		.catch(err => {
			clearInterval(progressInterval);
			if (window.uploadCancelled) {
				window.uploadCancelled = false;
				return;
			}
			console.error('Upload error:', err);
			hideFloatingUpload();
			showError(`Upload failed: ${err.message || 'Network error'}`);
			uploadBtn.disabled = false;
			uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload';
		});
	}

	// Expose helpers to template
	window.uploadFiles = uploadFiles;
	window.removeSelectedFile = (idx) => {
		selectedFiles.splice(idx, 1);
		updateFileList();
	};
	window.openUploadModal = () => {
		resetUploadUI();
		uploadModal.style.display = 'flex';
	};
	window.closeUploadModal = () => {
		uploadModal.style.display = 'none';
		resetUploadUI();
	};
	if (fileList) {
		fileList.addEventListener('click', (e) => {
			const btn = e.target.closest('button[data-index]');
			if (!btn) return;
			const idx = parseInt(btn.dataset.index, 10);
			if (Number.isNaN(idx)) return;
			selectedFiles.splice(idx, 1);
			updateFileList();
		});
	}

	if (uploadBtn) uploadBtn.addEventListener('click', uploadFiles);	if (cancelUploadBtn) cancelUploadBtn.addEventListener('click', () => window.closeUploadModal());
	if (uploadModalCloseBtn) uploadModalCloseBtn.addEventListener('click', () => window.closeUploadModal());

	resetUploadUI();
});

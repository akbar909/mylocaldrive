// Shared file operations for Dashboard and Files pages
(() => {
	// DOM Elements (may or may not exist on both pages)
	const dropZone = document.getElementById('dropZone');
	const fileInput = document.getElementById('fileInput');
	const fileListContainer = document.getElementById('fileListContainer');
	const fileList = document.getElementById('fileList');
	const uploadBtn = document.getElementById('uploadBtn');
	const uploadModal = document.getElementById('uploadModal');
	const uploadModalCloseBtn = document.getElementById('uploadModalCloseBtn');
	const cancelUploadBtn = document.getElementById('cancelUploadBtn');
	const selectFilesBtn = document.getElementById('selectFilesBtn');
	const sortSelect = document.getElementById('sortSelect');
	const renameModal = document.getElementById('renameModal');
	const shareModal = document.getElementById('shareModal');
	const confirmModal = document.getElementById('confirmModal');
	const confirmMessageEl = document.getElementById('confirmMessage');
	const confirmOkBtn = document.getElementById('confirmOk');
	const confirmCancelBtn = document.getElementById('confirmCancel');

	// Upload button IDs vary by page
	const uploadOpenBtns = [
		document.getElementById('uploadBtnFloat'),        // Dashboard floating button
		document.getElementById('quickUploadBtn'),         // Dashboard quick upload
		document.getElementById('filesUploadBtn'),         // Files page upload button
		document.getElementById('filesUploadEmptyBtn'),    // Files page empty state button
	].filter(Boolean);

	let selectedFiles = [];

	// ===== Helper Functions =====
	const formatSize = (size) => {
		if (size < 1024) return `${size} B`;
		if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
		if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
		return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
	};

	const updateFileList = () => {
		if (!fileListContainer || !uploadBtn || !fileList) return;

		if (selectedFiles.length === 0) {
			fileListContainer.style.display = 'none';
			uploadBtn.style.display = 'none';
			return;
		}

		fileListContainer.style.display = 'block';
		uploadBtn.style.display = 'block';
		
		// Update file count
		const fileCountEl = document.getElementById('fileCount');
		if (fileCountEl) fileCountEl.textContent = selectedFiles.length;
		
		fileList.innerHTML = selectedFiles.map((file, index) => (
			`<div style="padding: 0.75rem 1rem; color: var(--text-light); border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; gap: 0.75rem;">
				<div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0; overflow: hidden;">
					<i class="fas fa-file" style="color: var(--primary-color); flex-shrink: 0;"></i>
					<span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; font-size: 0.875rem;" title="${file.name}">${file.name}</span>
				</div>
				<div style="display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0;">
					<span style="font-size: 0.75rem; color: var(--gray-400); white-space: nowrap;">${formatSize(file.size)}</span>
					<button class="file-remove-btn" data-file-index="${index}" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 0.25rem; font-size: 0.875rem; transition: transform 0.2s;" title="Remove">
						<i class="fas fa-times-circle"></i>
					</button>
				</div>
			</div>`
		)).join('');
		
		// Add event listeners to remove buttons
		document.querySelectorAll('.file-remove-btn').forEach(btn => {
			btn.addEventListener('click', (e) => {
				e.preventDefault();
				const index = parseInt(btn.dataset.fileIndex);
				window.removeFileFromList(index);
			});
			
			// Add hover effect via JS instead of inline handlers
			btn.addEventListener('mouseenter', () => {
				btn.style.transform = 'scale(1.2)';
			});
			btn.addEventListener('mouseleave', () => {
				btn.style.transform = 'scale(1)';
			});
		});
	};

	// Remove file from list
	window.removeFileFromList = (index) => {
		selectedFiles.splice(index, 1);
		updateFileList();
	};

	const confirmAction = async (message) => {
		if (!confirmModal || !confirmMessageEl || !confirmOkBtn || !confirmCancelBtn) {
			return window.confirm(message);
		}
		return new Promise((resolve) => {
			confirmMessageEl.textContent = message;
			confirmModal.style.display = 'flex';
			const cleanup = () => {
				confirmModal.style.display = 'none';
				confirmOkBtn.onclick = null;
				confirmCancelBtn.onclick = null;
			};
			confirmOkBtn.onclick = () => { cleanup(); resolve(true); };
			confirmCancelBtn.onclick = () => { cleanup(); resolve(false); };
		});
	};

	// ===== Upload Functions =====
	const openUploadModal = () => {
		if (uploadModal) uploadModal.style.display = 'flex';
	};

	const closeUploadModal = (clearFiles = true) => {
		if (uploadModal) uploadModal.style.display = 'none';
		if (clearFiles) {
			selectedFiles = [];
			updateFileList();
		}
		if (uploadBtn) {
			uploadBtn.disabled = false;
			uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload';
		}
		const progressContainer = document.getElementById('progressContainer');
		if (progressContainer) progressContainer.style.display = 'none';
	};

	// Upload files with progress popup
	let cancelledFiles = new Set();
	let cancelAllRequested = false;
	let currentUploadingIndex = -1;
	let currentUploadController = null;
	let progressPanelHidden = false;
	let progressPanelCollapsed = false;

	const isMobileProgressView = () => window.innerWidth <= 768;
	const getHiddenTransform = () => 'translateY(110%)';
	const getVisibleTransform = () => 'translateY(0)';
	
	window.uploadFiles = async () => {
		if (!uploadBtn) return;
		if (selectedFiles.length === 0) {
			window.showError && window.showError('Please select files to upload');
			return;
		}

		// Close upload modal WITHOUT clearing files
		closeUploadModal(false);
		showProgressPopup();
		
		cancelAllRequested = false;
		currentUploadingIndex = -1;
		currentUploadController = null;
		cancelledFiles.clear();

		// Update summary
		const summaryEl = document.getElementById('progressPopupSummary');
		if (summaryEl) summaryEl.textContent = `0 of ${selectedFiles.length} files`;
		
		// Create file list in progress popup
		const uploadFilesList = document.getElementById('uploadFilesList');
		
		if (uploadFilesList) {
			uploadFilesList.innerHTML = selectedFiles.map((file, index) => `
				<div id="uploadFile_${index}" style="padding: 0.85rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); transition: opacity 0.3s;">
					<div style="display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; margin-bottom: 0.55rem;">
						<div style="display: flex; align-items: center; gap: 0.6rem; min-width: 0; flex: 1;">
							<i class="fas fa-file" style="color: var(--primary-color); font-size: 1rem; flex-shrink: 0;"></i>
							<div style="min-width: 0; flex: 1;">
								<div style="font-size: 0.88rem; color: var(--text-dark); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${file.name}">${file.name}</div>
								<div style="font-size: 0.74rem; color: var(--text-light); margin-top: 0.15rem;">${formatSize(file.size)}</div>
							</div>
						</div>
						<div style="display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0;">
							<span id="fileStatus_${index}" style="font-size: 0.73rem; color: var(--text-light); white-space: nowrap;">
								<i class="fas fa-clock" style="opacity: 0.5;"></i> Waiting...
							</span>
							<button class="cancel-file-btn" data-file-index="${index}" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 0.2rem; font-size: 1rem; opacity: 0.8; transition: all 0.2s;" title="Cancel this file">
								<i class="fas fa-times-circle"></i>
							</button>
						</div>
					</div>
					<div style="background: rgba(0,0,0,0.3); height: 6px; border-radius: 6px; overflow: hidden;">
						<div id="fileProgress_${index}" style="background: linear-gradient(90deg, var(--primary-color), #06b6d4); height: 100%; width: 0%; transition: width 0.3s ease;"></div>
					</div>
				</div>
			`).join('');
			// Add event listeners to cancel buttons
			document.querySelectorAll('.cancel-file-btn').forEach(btn => {
				btn.addEventListener('click', (e) => {
					e.preventDefault();
					const index = parseInt(btn.dataset.fileIndex);
					cancelFileUpload(index);
				});
				btn.addEventListener('mouseenter', () => {
					btn.style.opacity = '1';
					btn.style.transform = 'scale(1.15)';
				});
				btn.addEventListener('mouseleave', () => {
					btn.style.opacity = '0.7';
					btn.style.transform = 'scale(1)';
				});
			});
		}

		const totalFiles = selectedFiles.length;
		let uploadedCount = 0;
		let failedCount = 0;

		const updateSummary = () => {
			const summaryEl = document.getElementById('progressPopupSummary');
			if (!summaryEl) return;
			const cancelledCount = cancelledFiles.size;
			summaryEl.textContent = `${uploadedCount} uploaded • ${cancelledCount} cancelled • ${failedCount} failed • ${totalFiles} total`;
		};

		for (let index = 0; index < selectedFiles.length; index += 1) {
			if (cancelAllRequested) break;
			if (cancelledFiles.has(index)) {
				updateSummary();
				continue;
			}

			const file = selectedFiles[index];
			const statusEl = document.getElementById(`fileStatus_${index}`);
			const progressEl = document.getElementById(`fileProgress_${index}`);

			if (statusEl) statusEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
			currentUploadingIndex = index;
			currentUploadController = new AbortController();

			const progressInterval = setInterval(() => {
				if (!progressEl || cancelledFiles.has(index)) return;
				const currentWidth = parseInt(progressEl.style.width, 10) || 0;
				if (currentWidth < 90) {
					progressEl.style.width = `${currentWidth + Math.random() * 12}%`;
				}
			}, 180);

			try {
				const formData = new FormData();
				formData.append('files', file);
				const res = await fetch('/files/upload', {
					method: 'POST',
					body: formData,
					signal: currentUploadController.signal,
				});
				const data = await res.json();
				clearInterval(progressInterval);

				if (cancelledFiles.has(index)) {
					if (statusEl) statusEl.innerHTML = '<i class="fas fa-ban" style="color: #ef4444;"></i> Cancelled';
					if (progressEl) progressEl.style.width = '0%';
					updateSummary();
					continue;
				}

				if (data.success) {
					uploadedCount += 1;
					if (progressEl) progressEl.style.width = '100%';
					if (statusEl) statusEl.innerHTML = '<i class="fas fa-check-circle" style="color: #10b981;"></i> Complete';
				} else {
					failedCount += 1;
					if (statusEl) statusEl.innerHTML = '<i class="fas fa-times-circle" style="color: #ef4444;"></i> Failed';
				}
				updateSummary();
			} catch (err) {
				clearInterval(progressInterval);
				if (err.name === 'AbortError') {
					if (cancelAllRequested || cancelledFiles.has(index)) {
						if (statusEl) statusEl.innerHTML = '<i class="fas fa-ban" style="color: #ef4444;"></i> Cancelled';
						if (progressEl) progressEl.style.width = '0%';
						updateSummary();
						continue;
					}
				}
				failedCount += 1;
				if (statusEl) statusEl.innerHTML = '<i class="fas fa-times-circle" style="color: #ef4444;"></i> Failed';
				updateSummary();
			}
		}

		currentUploadingIndex = -1;
		currentUploadController = null;

		if (cancelAllRequested) {
			window.showError && window.showError('Upload cancelled');
			setTimeout(() => hideProgressPopup(), 900);
			return;
		}

		if (uploadedCount > 0) {
			window.showSuccess && window.showSuccess(`${uploadedCount} file(s) uploaded successfully`);
		}

		setTimeout(() => {
			hideProgressPopup();
			location.reload();
		}, 1800);
	};

	// Progress popup helper functions
	const showProgressPopup = () => {
		const popup = document.getElementById('uploadProgressPopup');
		const reopenBtn = document.getElementById('reopenUploadPanelBtn');
		if (popup) {
			popup.style.display = 'block';
			popup.style.width = isMobileProgressView() ? 'calc(100vw - 16px)' : '380px';
			progressPanelCollapsed = false;
			updateProgressCollapseUI();
			progressPanelHidden = false;
			if (reopenBtn) reopenBtn.style.display = 'none';
			// Trigger slide-in animation
			setTimeout(() => {
				popup.style.transform = getVisibleTransform();
			}, 10);
		} else {
			console.error('[Upload] Progress popup element not found!');
		}
	};

	const hideProgressPopup = () => {
		const popup = document.getElementById('uploadProgressPopup');
		const reopenBtn = document.getElementById('reopenUploadPanelBtn');
		if (popup) {
			// Slide out animation
			popup.style.transform = getHiddenTransform();
			setTimeout(() => {
				popup.style.display = 'none';
				if (reopenBtn) reopenBtn.style.display = 'none';
				progressPanelHidden = false;
				selectedFiles = [];  // Clear files after popup is hidden
				updateFileList();
			}, 300);
		}
	};

	const toggleProgressVisibility = () => {
		const popup = document.getElementById('uploadProgressPopup');
		const reopenBtn = document.getElementById('reopenUploadPanelBtn');
		if (!popup) return;

		if (!progressPanelHidden) {
			popup.style.transform = getHiddenTransform();
			progressPanelHidden = true;
			if (reopenBtn) reopenBtn.style.display = 'flex';
			return;
		}

		popup.style.display = 'block';
		setTimeout(() => {
			popup.style.transform = getVisibleTransform();
		}, 10);
		progressPanelHidden = false;
		if (reopenBtn) reopenBtn.style.display = 'none';
	};

	const updateProgressCollapseUI = () => {
		const popup = document.getElementById('uploadProgressPopup');
		const content = document.getElementById('progressPopupContent');
		const titleBlock = document.getElementById('progressTitleBlock');
		const cancelAllBtn = document.getElementById('cancelAllUploadsBtn');
		const collapseBtn = document.getElementById('toggleCollapseBtn');
		if (!popup || !content || !titleBlock || !cancelAllBtn || !collapseBtn) return;

		if (isMobileProgressView()) {
			popup.style.width = 'calc(100vw - 16px)';
			content.style.display = 'block';
			titleBlock.style.display = 'block';
			cancelAllBtn.style.display = 'inline-flex';
			collapseBtn.style.display = 'none';
			progressPanelCollapsed = false;
			return;
		}

		collapseBtn.style.display = 'inline-flex';

		if (progressPanelCollapsed) {
			popup.style.width = '300px';
			content.style.display = 'none';
			titleBlock.style.display = 'block';
			cancelAllBtn.style.display = 'none';
			collapseBtn.title = 'Expand Panel';
			const icon = collapseBtn.querySelector('i');
			if (icon) icon.className = 'fas fa-chevron-up';
		} else {
			popup.style.width = '380px';
			content.style.display = 'block';
			titleBlock.style.display = 'block';
			cancelAllBtn.style.display = 'inline-flex';
			collapseBtn.title = 'Collapse Panel';
			const icon = collapseBtn.querySelector('i');
			if (icon) icon.className = 'fas fa-chevron-down';
		}
	};

	const toggleProgressCollapse = () => {
		progressPanelCollapsed = !progressPanelCollapsed;
		updateProgressCollapseUI();
	};

	const cancelFileUpload = (index) => {
		if (cancelledFiles.has(index)) return;
		
		cancelledFiles.add(index);
		const fileEl = document.getElementById(`uploadFile_${index}`);
		const statusEl = document.getElementById(`fileStatus_${index}`);
		const cancelBtn = document.querySelector(`.cancel-file-btn[data-file-index="${index}"]`);
		
		if (fileEl) {
			fileEl.style.opacity = '0.5';
		}
		if (statusEl) {
			statusEl.innerHTML = '<i class="fas fa-ban" style="color: #ef4444;"></i> Cancelled';
		}
		if (cancelBtn) {
			cancelBtn.disabled = true;
			cancelBtn.style.opacity = '0.35';
			cancelBtn.style.cursor = 'not-allowed';
		}
		if (index === currentUploadingIndex && currentUploadController) {
			currentUploadController.abort();
		}
		
		// Update summary
		const summaryEl = document.getElementById('progressPopupSummary');
		if (summaryEl) {
			const remaining = selectedFiles.length - cancelledFiles.size;
			summaryEl.textContent = `Uploading ${remaining} of ${selectedFiles.length} files`;
		}
	};

	const cancelAllUploads = async () => {
		const ok = await confirmAction('Cancel all uploads? Files will not be uploaded.');
		if (!ok) return;

		cancelAllRequested = true;
		if (currentUploadController) {
			currentUploadController.abort();
		}

		selectedFiles.forEach((_, index) => {
			if (!cancelledFiles.has(index)) cancelFileUpload(index);
		});

		setTimeout(() => hideProgressPopup(), 900);
	};

	// Expose progress popup functions
	window.cancelFileUpload = cancelFileUpload;
	window.cancelAllUploads = cancelAllUploads;
	window.hideProgressPopup = hideProgressPopup;
	window.toggleProgressVisibility = toggleProgressVisibility;
	window.toggleProgressCollapse = toggleProgressCollapse;

	// Expose open modal for external use
	window.openUploadModal = openUploadModal;

	// ===== File Details =====
	window.showFileDetails = (fileId, fileName, fileSize, uploadDate) => {
		const modal = document.getElementById('fileDetailsModal');
		const fileNameEl = document.getElementById('detailFileName');
		const fileSizeEl = document.getElementById('detailFileSize');
		const uploadDateEl = document.getElementById('detailUploadDate');

		if (fileNameEl) fileNameEl.textContent = fileName;
		if (fileSizeEl) fileSizeEl.textContent = formatSize(fileSize);
		if (uploadDateEl) {
			const date = new Date(uploadDate);
			uploadDateEl.textContent = date.toLocaleDateString('en-US', { 
				year: 'numeric', 
				month: 'long', 
				day: 'numeric', 
				hour: '2-digit', 
				minute: '2-digit' 
			});
		}
		if (modal) modal.style.display = 'flex';
	};

	// ===== Delete Functions =====
	window.deleteFileFromDashboard = async (fileId) => {
		if (!fileId) return;
		const ok = await confirmAction('Move this file to the Recycle Bin?');
		if (!ok) return;
		
		fetch(`/files/${fileId}`, { method: 'DELETE' })
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					window.showSuccess && window.showSuccess('File deleted successfully');
					setTimeout(() => location.reload(), 1500);
				} else {
					window.showError && window.showError(data.error || 'Failed to delete file');
				}
			})
			.catch((err) => {
				console.error('Delete error:', err);
				window.showError && window.showError('Failed to delete file');
			});
	};

	// Alias for files page
	window.deleteFile = window.deleteFileFromDashboard;

	window.restoreFile = async (fileId) => {
		if (!fileId) return;
		fetch(`/files/${fileId}/restore`, { method: 'POST' })
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					window.showSuccess && window.showSuccess('File restored successfully');
					setTimeout(() => location.reload(), 1500);
				} else {
					window.showError && window.showError(data.error || 'Failed to restore file');
				}
			})
			.catch((err) => {
				console.error('Restore error:', err);
				window.showError && window.showError('Failed to restore file');
			});
	};

	window.deleteForever = async (fileId) => {
		if (!fileId) return;
		const ok = await confirmAction('Permanently delete this file? This cannot be undone.');
		if (!ok) return;
		
		fetch(`/files/${fileId}/permanent`, { method: 'DELETE' })
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					window.showSuccess && window.showSuccess('File permanently deleted');
					setTimeout(() => location.reload(), 1500);
				} else {
					window.showError && window.showError(data.error || 'Failed to delete file permanently');
				}
			})
			.catch((err) => {
				console.error('Permanent delete error:', err);
				window.showError && window.showError('Failed to delete file permanently');
			});
	};

	// ===== Rename Functions =====
	window.showRenameModal = (fileId, fileName) => {
		const renameFileId = document.getElementById('renameFileId');
		const renameOriginalExt = document.getElementById('renameOriginalExt');
		const newFileName = document.getElementById('newFileName');
		if (!renameModal || !renameFileId || !newFileName) return;

		const lastDotIndex = fileName.lastIndexOf('.');
		const baseName = lastDotIndex > 0 ? fileName.slice(0, lastDotIndex) : fileName;
		const ext = lastDotIndex > 0 ? fileName.slice(lastDotIndex) : '';
		
		renameFileId.value = fileId;
		if (renameOriginalExt) renameOriginalExt.value = ext;
		newFileName.value = baseName;
		renameModal.style.display = 'flex';
		newFileName.focus();
		newFileName.select();
	};

	window.confirmRename = () => {
		const renameFileId = document.getElementById('renameFileId');
		const renameOriginalExt = document.getElementById('renameOriginalExt');
		const newFileName = document.getElementById('newFileName');
		if (!renameFileId || !newFileName) return;
		
		const fileId = renameFileId.value;
		const baseName = newFileName.value.trim();
		const ext = renameOriginalExt ? renameOriginalExt.value : '';
		const newName = `${baseName}${ext}`;
		
		if (!baseName) {
			window.showError && window.showError('Please enter a file name');
			return;
		}

		if (baseName.includes('.')) {
			window.showError && window.showError('Extension cannot be changed. Please edit only the name.');
			return;
		}

		fetch(`/files/${fileId}/rename`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ newName }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					if (renameModal) renameModal.style.display = 'none';
					window.showSuccess && window.showSuccess('File renamed successfully');
					setTimeout(() => location.reload(), 1500);
				} else {
					window.showError && window.showError(data.error || 'Failed to rename file');
				}
			})
			.catch((err) => {
				console.error('Rename error:', err);
				window.showError && window.showError('Failed to rename file');
			});
	};

	// ===== Share Functions =====
	window.showShareModal = (fileId) => {
		const shareFileId = document.getElementById('shareFileId');
		const shareUsername = document.getElementById('shareUsername');
		const shareLink = document.getElementById('shareLink');
		
		if (!shareModal || !shareFileId || !shareUsername) return;
		
		shareFileId.value = fileId;
		shareUsername.value = '';
		if (shareLink) shareLink.value = '';
		
		// Generate share link for this file
		generateShareLink(fileId);
		
		shareModal.style.display = 'flex';
		shareUsername.focus();
	};

	const generateShareLink = async (fileId) => {
		try {
			const res = await fetch(`/files/${fileId}/generate-share-link`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			});
			const data = await res.json();
			
			const shareLinkInput = document.getElementById('shareLink');
			if (shareLinkInput) {
				if (data.success && data.shareLink) {
					shareLinkInput.value = data.shareLink;
				} else {
					shareLinkInput.value = 'Failed to generate link';
				}
			}
		} catch (err) {
			console.error('Error generating share link:', err);
			const shareLinkInput = document.getElementById('shareLink');
			if (shareLinkInput) shareLinkInput.value = 'Error generating link';
		}
	};

	window.copyShareLink = () => {
		const linkInput = document.getElementById('shareLink');
		if (!linkInput || !linkInput.value) {
			window.showError && window.showError('No link to copy');
			return;
		}
		
		linkInput.select();
		document.execCommand('copy');
		
		// Show feedback
		const btn = document.getElementById('copyLinkBtn');
		if (btn) {
			const originalHTML = btn.innerHTML;
			btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
			btn.style.background = '#10b981';
			
			setTimeout(() => {
				btn.innerHTML = originalHTML;
				btn.style.background = '#06b6d4';
			}, 2000);
		}
	};

	window.confirmShare = () => {
		const shareFileId = document.getElementById('shareFileId');
		const shareUsername = document.getElementById('shareUsername');
		if (!shareFileId || !shareUsername) return;
		
		const fileId = shareFileId.value;
		const username = shareUsername.value.trim();
		
		if (!username) {
			window.showError && window.showError('Please enter a username');
			return;
		}

		fetch(`/files/${fileId}/share`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ sharedWithUsername: username }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					if (shareModal) shareModal.style.display = 'none';
					window.showSuccess && window.showSuccess('File shared successfully!');
					setTimeout(() => location.reload(), 1500);
				} else {
					window.showError && window.showError(data.error || 'Failed to share file');
				}
			})
			.catch((err) => {
				console.error('Share error:', err);
				window.showError && window.showError('Failed to share file');
			});
	};

	// ===== Bulk Trash Operations (Files page only) =====
	window.toggleSelectAllTrash = () => {
		const selectAllCheckbox = document.getElementById('selectAllTrash');
		const trashCheckboxes = document.querySelectorAll('.trashCheckbox');
		if (!selectAllCheckbox) return;
		
		trashCheckboxes.forEach(checkbox => {
			checkbox.checked = selectAllCheckbox.checked;
		});
		updateTrashSelection();
	};

	window.updateTrashSelection = () => {
		const trashCheckboxes = document.querySelectorAll('.trashCheckbox:checked');
		const selectAllCheckbox = document.getElementById('selectAllTrash');
		const countEl = document.getElementById('trashSelectedCount');
		const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
		const bulkRestoreBtn = document.getElementById('bulkRestoreBtn');

		const count = trashCheckboxes.length;
		if (countEl) countEl.textContent = count + ' selected';

		// Update select all checkbox state
		const totalCheckboxes = document.querySelectorAll('.trashCheckbox').length;
		if (selectAllCheckbox) {
			selectAllCheckbox.checked = count === totalCheckboxes && totalCheckboxes > 0;
			selectAllCheckbox.indeterminate = count > 0 && count < totalCheckboxes;
		}

		// Show/hide bulk action buttons
		if (bulkDeleteBtn) bulkDeleteBtn.style.display = count > 0 ? 'block' : 'none';
		if (bulkRestoreBtn) bulkRestoreBtn.style.display = count > 0 ? 'block' : 'none';
	};

	window.bulkDeleteTrash = async () => {
		const trashCheckboxes = document.querySelectorAll('.trashCheckbox:checked');
		if (trashCheckboxes.length === 0) {
			window.showError && window.showError('Please select files to delete');
			return;
		}

		const ok = await confirmAction(`Permanently delete ${trashCheckboxes.length} file(s)? This cannot be undone.`);
		if (!ok) return;

		const fileIds = Array.from(trashCheckboxes).map(cb => cb.value);
		let deletedCount = 0;

		for (const fileId of fileIds) {
			try {
				const res = await fetch(`/files/${fileId}/permanent`, { method: 'DELETE' });
				const data = await res.json();
				if (data.success) deletedCount++;
			} catch (err) {
				console.error('Error deleting file:', err);
			}
		}

		if (deletedCount > 0) {
			window.showSuccess && window.showSuccess(`${deletedCount} file(s) permanently deleted`);
			setTimeout(() => location.reload(), 1500);
		} else {
			window.showError && window.showError('Failed to delete selected files');
		}
	};

	window.bulkRestoreTrash = async () => {
		const trashCheckboxes = document.querySelectorAll('.trashCheckbox:checked');
		if (trashCheckboxes.length === 0) {
			window.showError && window.showError('Please select files to restore');
			return;
		}

		const fileIds = Array.from(trashCheckboxes).map(cb => cb.value);
		let restoredCount = 0;

		for (const fileId of fileIds) {
			try {
				const res = await fetch(`/files/${fileId}/restore`, { method: 'POST' });
				const data = await res.json();
				if (data.success) restoredCount++;
			} catch (err) {
				console.error('Error restoring file:', err);
			}
		}

		if (restoredCount > 0) {
			window.showSuccess && window.showSuccess(`${restoredCount} file(s) restored successfully`);
			setTimeout(() => location.reload(), 1500);
		} else {
			window.showError && window.showError('Failed to restore selected files');
		}
	};

	// ===== Sorting Handler (Files page) =====
	window.handleSort = (sortValue) => {
		const currentPage = new URLSearchParams(window.location.search).get('page') || '1';
		window.location.href = `/files?sort=${sortValue}&page=1`;
	};

	// ===== Event Listeners =====
	
	// Drag and Drop
	if (dropZone) {
		dropZone.addEventListener('dragover', (e) => {
			e.preventDefault();
			dropZone.style.background = 'rgba(129, 140, 248, 0.15)';
			dropZone.style.borderColor = '#06b6d4';
		});

		dropZone.addEventListener('dragleave', () => {
			dropZone.style.background = 'rgba(129, 140, 248, 0.07)';
			dropZone.style.borderColor = 'var(--primary-color)';
		});

		dropZone.addEventListener('drop', (e) => {
			e.preventDefault();
			dropZone.style.background = 'rgba(129, 140, 248, 0.07)';
			dropZone.style.borderColor = 'var(--primary-color)';
			selectedFiles = Array.from(e.dataTransfer.files || []);
			updateFileList();
		});

		dropZone.addEventListener('click', () => {
			if (fileInput) fileInput.click();
		});
	}

	// File input change
	if (fileInput) {
		fileInput.addEventListener('change', (e) => {
			selectedFiles = Array.from(e.target.files);
			updateFileList();
		});
	}

	// Upload buttons
	uploadOpenBtns.forEach(btn => {
		if (btn) btn.addEventListener('click', openUploadModal);
	});

	if (uploadModalCloseBtn) uploadModalCloseBtn.addEventListener('click', closeUploadModal);
	if (cancelUploadBtn) cancelUploadBtn.addEventListener('click', closeUploadModal);
	if (selectFilesBtn) selectFilesBtn.addEventListener('click', () => fileInput && fileInput.click());

	// Sort select
	if (sortSelect) {
		sortSelect.addEventListener('change', (e) => window.handleSort(e.target.value));
	}

	// Close modals on outside click
	[uploadModal, renameModal, shareModal, confirmModal].forEach((modal) => {
		if (!modal) return;
		modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				if (modal === uploadModal) {
					closeUploadModal();
				} else {
					modal.style.display = 'none';
				}
			}
		});
	});

	// Enter key helpers
	const newFileNameInput = document.getElementById('newFileName');
	if (newFileNameInput) {
		newFileNameInput.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') window.confirmRename();
		});
	}

	const shareUsernameInput = document.getElementById('shareUsername');
	if (shareUsernameInput) {
		shareUsernameInput.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') window.confirmShare();
		});
	}

	// Upload on button click
	if (uploadBtn) {
		uploadBtn.addEventListener('click', window.uploadFiles);
	}

	const reopenUploadPanelBtn = document.getElementById('reopenUploadPanelBtn');
	if (reopenUploadPanelBtn) {
		reopenUploadPanelBtn.addEventListener('click', () => {
			if (window.toggleProgressVisibility) window.toggleProgressVisibility();
		});
	}

	window.addEventListener('resize', () => {
		const popup = document.getElementById('uploadProgressPopup');
		if (!popup || popup.style.display === 'none') return;
		updateProgressCollapseUI();
		popup.style.transform = progressPanelHidden ? getHiddenTransform() : getVisibleTransform();
	});

})();

// Files page behaviors (upload, delete, rename, share)
(() => {
	const dropZone = document.getElementById('dropZone');
	const fileInput = document.getElementById('fileInput');
	const fileInputSingle = document.getElementById('fileInputSingle');
	const fileListContainer = document.getElementById('fileListContainer');
	const fileList = document.getElementById('fileList');
	const uploadBtn = document.getElementById('uploadBtn');
	const renameModal = document.getElementById('renameModal');
	const shareModal = document.getElementById('shareModal');
	const uploadModal = document.getElementById('uploadModal');
	const confirmModal = document.getElementById('confirmModal');
	const confirmMessageEl = document.getElementById('confirmMessage');
	const confirmOkBtn = document.getElementById('confirmOk');
	const confirmCancelBtn = document.getElementById('confirmCancel');

	let selectedFiles = [];

	// Helpers
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
		fileList.innerHTML = selectedFiles.map((file) => (
			`<div style="padding: 0.5rem 0; color: var(--text-light); border-bottom: 1px solid rgba(255,255,255,0.1);">
				<span><i class="fas fa-file" style="margin-right: 0.5rem;"></i>${file.name}</span> <span style="font-size: 0.75rem; color: var(--gray-400);">${formatSize(file.size)}</span>
			</div>`
		)).join('');
	};

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
			selectedFiles = Array.from(e.dataTransfer.files || []);
			updateFileList();
		});
	}

	// File input change
	[fileInput, fileInputSingle].forEach((input) => {
		if (!input) return;
		input.addEventListener('change', (e) => {
			selectedFiles = Array.from(e.target.files);
			updateFileList();
		});
	});

	// Upload
	window.uploadFiles = () => {
		if (!uploadBtn) return;
		if (selectedFiles.length === 0) {
			showError('Please select files to upload');
			return;
		}

		uploadBtn.disabled = true;
		uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
		const progressContainer = document.getElementById('progressContainer');
		if (progressContainer) progressContainer.style.display = 'block';

		const formData = new FormData();
		selectedFiles.forEach((file) => formData.append('files', file));

		fetch('/files/upload', {
			method: 'POST',
			body: formData,
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					if (uploadModal) uploadModal.style.display = 'none';
					location.reload();
				} else {
					showError(data.error || 'Upload failed');
					uploadBtn.disabled = false;
					uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload';
				}
			})
			.catch((err) => {
				console.error('Upload error:', err);
				showError('Upload failed');
				uploadBtn.disabled = false;
				uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload';
			});
	};

	// Delete
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

	window.deleteFile = async (fileId) => {
		if (!fileId) return;
		const ok = await confirmAction('Move this file to the Recycle Bin?');
		if (!ok) return;
		fetch(`/files/${fileId}`, { method: 'DELETE' })
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					showSuccess('File deleted successfully');
					setTimeout(() => location.reload(), 1500);
				} else {
					showError(data.error || 'Failed to delete file');
				}
			})
			.catch((err) => {
				console.error('Delete error:', err);
				showError('Failed to delete file');
			});
	};

	window.restoreFile = async (fileId) => {
		if (!fileId) return;
		fetch(`/files/${fileId}/restore`, { method: 'POST' })
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					showSuccess('File restored successfully');
					setTimeout(() => location.reload(), 1500);
				} else {
					showError(data.error || 'Failed to restore file');
				}
			})
			.catch((err) => {
				console.error('Restore error:', err);
				showError('Failed to restore file');
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
					showSuccess('File permanently deleted');
					setTimeout(() => location.reload(), 1500);
				} else {
					showError(data.error || 'Failed to delete file permanently');
				}
			})
			.catch((err) => {
				console.error('Permanent delete error:', err);
				showError('Failed to delete file permanently');
			});
	};

	// View File
	let currentViewFileId = null;
	window.viewFile = (fileId, mimeType, fileName) => {
		if (!fileId) return;
		currentViewFileId = fileId;
		const viewerModal = document.getElementById('fileViewerModal');
		const viewerFrame = document.getElementById('fileViewerFrame');
		const viewerImage = document.getElementById('fileViewerImage');
		const viewerStatus = document.getElementById('fileViewerStatus');

		if (!viewerModal) return;

		if (viewerStatus) {
			viewerStatus.textContent = 'Loading preview...';
			viewerStatus.style.display = 'flex';
		}

		const isImage = mimeType && mimeType.startsWith('image/');
		const isPdf = mimeType === 'application/pdf' || (fileName && fileName.toLowerCase().endsWith('.pdf'));

		if (viewerImage) viewerImage.style.display = 'none';
		if (viewerFrame) viewerFrame.style.display = 'none';

		if (isImage && viewerImage) {
			viewerImage.onload = () => { if (viewerStatus) viewerStatus.style.display = 'none'; };
			viewerImage.onerror = () => { if (viewerStatus) viewerStatus.textContent = 'Preview unavailable. Try downloading instead.'; };
			viewerImage.src = `/files/${fileId}/view`;
			viewerImage.style.display = 'block';
		} else if (viewerFrame) {
			viewerFrame.onload = () => { if (viewerStatus) viewerStatus.style.display = 'none'; };
			viewerFrame.onerror = () => { if (viewerStatus) viewerStatus.textContent = 'Preview unavailable. Try downloading instead.'; };
			viewerFrame.src = `/files/${fileId}/view${isPdf ? '#toolbar=0' : ''}`;
			viewerFrame.style.display = 'block';
		}

		viewerModal.style.display = 'flex';
	};

	// Close viewer on overlay click or ESC
	const viewerModalEl = document.getElementById('fileViewerModal');
	if (viewerModalEl) {
		viewerModalEl.addEventListener('click', (e) => {
			if (e.target === viewerModalEl) viewerModalEl.style.display = 'none';
		});
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && viewerModalEl.style.display === 'flex') {
				viewerModalEl.style.display = 'none';
			}
		});
	}

	window.downloadViewerFile = () => {
		if (!currentViewFileId) return;
		const link = document.createElement('a');
		link.href = `/files/${currentViewFileId}`;
		link.click();
	};

	// Rename
	window.showRenameModal = (fileId, fileName) => {
		const renameFileId = document.getElementById('renameFileId');
		const newFileName = document.getElementById('newFileName');
		if (!renameModal || !renameFileId || !newFileName) return;
		renameFileId.value = fileId;
		newFileName.value = fileName;
		renameModal.style.display = 'flex';
		newFileName.focus();
		newFileName.select();
	};

	window.confirmRename = () => {
		const renameFileId = document.getElementById('renameFileId');
		const newFileName = document.getElementById('newFileName');
		if (!renameFileId || !newFileName) return;
		const fileId = renameFileId.value;
		const newName = newFileName.value.trim();
		if (!newName) {
			showError('Please enter a file name');
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
					showSuccess('File renamed successfully');
					setTimeout(() => location.reload(), 1500);
				} else {
					showError(data.error || 'Failed to rename file');
				}
			})
			.catch((err) => console.error('Rename error:', err));
	};

	// Share
	window.showShareModal = (fileId) => {
		const shareFileId = document.getElementById('shareFileId');
		const shareUsername = document.getElementById('shareUsername');
		if (!shareModal || !shareFileId || !shareUsername) return;
		shareFileId.value = fileId;
		shareUsername.value = '';
		document.getElementById('shareLink').value = '';
		
		// Generate share link for this file
		generateShareLink(fileId);
		
		shareModal.style.display = 'flex';
		shareUsername.focus();
	};

	window.generateShareLink = async (fileId) => {
		try {
			const res = await fetch(`/files/${fileId}/generate-share-link`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			});
			const data = await res.json();
			
			if (data.success && data.shareLink) {
				document.getElementById('shareLink').value = data.shareLink;
			} else {
				document.getElementById('shareLink').value = 'Failed to generate link';
			}
		} catch (err) {
			console.error('Error generating share link:', err);
			document.getElementById('shareLink').value = 'Error generating link';
		}
	};

	window.copyShareLink = () => {
		const linkInput = document.getElementById('shareLink');
		if (!linkInput.value) {
			showError('No link to copy');
			return;
		}
		
		linkInput.select();
		document.execCommand('copy');
		
		// Show feedback
		const btn = document.getElementById('copyLinkBtn');
		const originalHTML = btn.innerHTML;
		btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
		btn.style.background = '#10b981';
		
		setTimeout(() => {
			btn.innerHTML = originalHTML;
			btn.style.background = '#06b6d4';
		}, 2000);
	};

	window.confirmShare = () => {
		const shareFileId = document.getElementById('shareFileId');
		const shareUsername = document.getElementById('shareUsername');
		if (!shareFileId || !shareUsername) return;
		const fileId = shareFileId.value;
		const username = shareUsername.value.trim();
		if (!username) {
			showError('Please enter a username');
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
					showSuccess('File shared successfully!');
					setTimeout(() => location.reload(), 1500);
				} else {
					showError(data.error || 'Failed to share file');
				}
			})
			.catch((err) => {
				console.error('Share error:', err);
				showError('Failed to share file');
			});
	};

	// Close modals on outside click
	[uploadModal, renameModal, shareModal].forEach((modal) => {
		if (!modal) return;
		modal.addEventListener('click', (e) => {
			if (e.target === modal) modal.style.display = 'none';
		});
	});

	// Enter key helpers
	const newFileNameInput = document.getElementById('newFileName');
	if (newFileNameInput) {
		newFileNameInput.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') window.confirmRename();
		});
	}
		// Bulk Trash Operations
		window.toggleSelectAllTrash = () => {
			const selectAllCheckbox = document.getElementById('selectAllTrash');
			const trashCheckboxes = document.querySelectorAll('.trashCheckbox');
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
				showError('Please select files to delete');
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
					if (data.success) {
						deletedCount++;
					}
				} catch (err) {
					console.error('Error deleting file:', err);
				}
			}

			if (deletedCount > 0) {
				showSuccess(`${deletedCount} file(s) permanently deleted`);
				setTimeout(() => location.reload(), 1500);
			} else {
				showError('Failed to delete selected files');
			}
		};

		window.bulkRestoreTrash = async () => {
			const trashCheckboxes = document.querySelectorAll('.trashCheckbox:checked');
			if (trashCheckboxes.length === 0) {
				showError('Please select files to restore');
				return;
			}

			const fileIds = Array.from(trashCheckboxes).map(cb => cb.value);
			let restoredCount = 0;

			for (const fileId of fileIds) {
				try {
					const res = await fetch(`/files/${fileId}/restore`, { method: 'POST' });
					const data = await res.json();
					if (data.success) {
						restoredCount++;
					}
				} catch (err) {
					console.error('Error restoring file:', err);
				}
			}

			if (restoredCount > 0) {
				showSuccess(`${restoredCount} file(s) restored successfully`);
				setTimeout(() => location.reload(), 1500);
			} else {
				showError('Failed to restore selected files');
			}
		};

	const shareUsernameInput = document.getElementById('shareUsername');
	if (shareUsernameInput) {
		shareUsernameInput.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') window.confirmShare();
		});
	}
})();

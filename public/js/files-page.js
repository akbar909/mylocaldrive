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

	const traverseFileTree = (item) => {
		if (item.isFile) {
			item.file((file) => {
				selectedFiles.push(file);
				updateFileList();
			});
		} else if (item.isDirectory) {
			const dirReader = item.createReader();
			dirReader.readEntries((entries) => {
				entries.forEach((entry) => traverseFileTree(entry));
			});
		}
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
			const items = e.dataTransfer.items;

			if (items) {
				for (let i = 0; i < items.length; i++) {
					const entry = items[i].webkitGetAsEntry();
					if (entry) traverseFileTree(entry);
				}
			} else {
				selectedFiles = Array.from(e.dataTransfer.files);
				updateFileList();
			}
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
		if (!confirmModal || !confirmMessage || !confirmOk || !confirmCancel) {
			return await showConfirm(message);
		}
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

	const shareUsernameInput = document.getElementById('shareUsername');
	if (shareUsernameInput) {
		shareUsernameInput.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') window.confirmShare();
		});
	}
})();

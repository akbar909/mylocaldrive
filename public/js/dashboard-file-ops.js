// Dashboard File Operations
const confirmModal = document.getElementById('confirmModal');
const confirmMessage = document.getElementById('confirmMessage');
const confirmOk = document.getElementById('confirmOk');
const confirmCancel = document.getElementById('confirmCancel');

const confirmAction = (message) => new Promise((resolve) => {
	if (!confirmModal || !confirmMessage || !confirmOk || !confirmCancel) {
		const fallback = window.confirm(message);
		resolve(fallback);
		return;
	}

	confirmMessage.textContent = message;
	confirmModal.style.display = 'flex';

	const cleanup = () => {
		confirmModal.style.display = 'none';
		confirmOk.onclick = null;
		confirmCancel.onclick = null;
	};

	confirmOk.onclick = () => { cleanup(); resolve(true); };
	confirmCancel.onclick = () => { cleanup(); resolve(false); };
});

async function deleteFileFromDashboard(fileId) {
	const ok = await confirmAction('Move this file to the Recycle Bin?');
	if (!ok) return;

	fetch(`/files/${fileId}`, {
		method: 'DELETE'
	})
	.then(res => res.json())
	.then(data => {
		if (data.success) {
			location.reload();
		} else {
			showError('Error deleting file: ' + data.error);
		}
	})
	.catch(err => console.error('Delete error:', err));
}

// View File in Modal
let currentViewFileId = null;
function viewFile(fileId, mimeType, fileName) {
	if (!fileId) return;
	currentViewFileId = fileId;
	const viewerModal = document.getElementById('fileViewerModal');
	const viewerFrame = document.getElementById('fileViewerFrame');
	const viewerImage = document.getElementById('fileViewerImage');
	const viewerStatus = document.getElementById('fileViewerStatus');

	if (!viewerModal) {
		window.open(`/files/${fileId}/view`, '_blank');
		return;
	}

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
}

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

function downloadViewerFile() {
	if (!currentViewFileId) return;
	const link = document.createElement('a');
	link.href = `/files/${currentViewFileId}`;
	link.click();
}

function showRenameModal(fileId, fileName) {
	document.getElementById('renameFileId').value = fileId;
	document.getElementById('newFileName').value = fileName;
	document.getElementById('renameModal').style.display = 'flex';
	document.getElementById('newFileName').focus();
	document.getElementById('newFileName').select();
}

function confirmRename() {
	const fileId = document.getElementById('renameFileId').value;
	const newName = document.getElementById('newFileName').value.trim();

	if (!newName) {
		showError('Please enter a file name');
		return;
	}

	fetch(`/files/${fileId}/rename`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ newName })
	})
	.then(res => res.json())
	.then(data => {
		if (data.success) {
			document.getElementById('renameModal').style.display = 'none';
			location.reload();
		} else {
			showError(data.error);
		}
	})
	.catch(err => console.error('Rename error:', err));
}

function showShareModal(fileId) {
	document.getElementById('shareFileId').value = fileId;
	document.getElementById('shareUsername').value = '';
	document.getElementById('shareLink').value = '';
	document.getElementById('copyLinkBtn').textContent = '📋 Copy';
	
	// Generate share link for this file
	generateShareLink(fileId);
	
	document.getElementById('shareModal').style.display = 'flex';
	document.getElementById('shareUsername').focus();
}

async function generateShareLink(fileId) {
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
}

function copyShareLink() {
	const linkInput = document.getElementById('shareLink');
	if (!linkInput.value) {
		showError('No link to copy');
		return;
	}
	
	linkInput.select();
	document.execCommand('copy');
	
	// Show feedback
	const btn = document.getElementById('copyLinkBtn');
	const originalText = btn.innerHTML;
	btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
	btn.style.background = '#10b981';
	
	setTimeout(() => {
		btn.innerHTML = originalText;
		btn.style.background = '#06b6d4';
	}, 2000);
}

function confirmShare() {
	const fileId = document.getElementById('shareFileId').value;
	const username = document.getElementById('shareUsername').value.trim();

	if (!username) {
		showError('Please enter a username');
		return;
	}

	fetch(`/files/${fileId}/share`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ sharedWithUsername: username })
	})
	.then(res => res.json())
	.then(data => {
		if (data.success) {
			document.getElementById('shareModal').style.display = 'none';
			location.reload();
		} else {
			showError(data.error);
		}
	})
	.catch(err => console.error('Share error:', err));
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
	const uploadModal = document.getElementById('uploadModal');
	const renameModal = document.getElementById('renameModal');
	const shareModal = document.getElementById('shareModal');
	if (event.target === uploadModal) uploadModal.style.display = 'none';
	if (event.target === renameModal) renameModal.style.display = 'none';
	if (event.target === shareModal) shareModal.style.display = 'none';
});

// Allow Enter key in rename
if (document.getElementById('newFileName')) {
	document.getElementById('newFileName').addEventListener('keypress', (e) => {
		if (e.key === 'Enter') confirmRename();
	});
}

// Allow Enter key in share
if (document.getElementById('shareUsername')) {
	document.getElementById('shareUsername').addEventListener('keypress', (e) => {
		if (e.key === 'Enter') confirmShare();
	});
}

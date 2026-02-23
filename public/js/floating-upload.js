// Floating Upload Progress Widget - Displays real-time file upload progress in corner overlay
(function() {
	// Create floating widget HTML - Builds the collapsible progress widget DOM structure
	function createFloatingWidget() {
		if (document.getElementById('floatingUploadWidget')) return;
		
		const widgetHTML = `
			<div id="floatingUploadWidget" style="display: none; position: fixed; bottom: 2rem; right: 2rem; z-index: 9998; width: 320px;">
				<div style="background: #111827; border: 1px solid rgba(129, 140, 248, 0.3); border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); overflow: hidden;">
					<!-- Header with collapse button -->
					<div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: linear-gradient(135deg, rgba(129, 140, 248, 0.1), rgba(6, 182, 212, 0.1)); border-bottom: 1px solid rgba(129, 140, 248, 0.2);">
						<div style="display: flex; align-items: center; gap: 0.75rem;">
							<i class="fas fa-cloud-upload-alt" style="color: var(--primary-color); font-size: 1.1rem;"></i>
							<div>
								<h4 style="margin: 0; font-size: 0.95rem; color: var(--text-dark); font-weight: 600;">Uploading Files</h4>
								<p id="floatFileName" style="margin: 0; font-size: 0.8rem; color: var(--text-light);">-</p>
							</div>
						</div>
						<button onclick="toggleFloatingWidget()" style="background: none; border: none; color: var(--text-light); cursor: pointer; font-size: 1rem;">
							<i id="floatToggleIcon" class="fas fa-chevron-down" aria-hidden="true"></i>
						</button>
					</div>

					<!-- Content (collapsible) -->
					<div id="floatingContent" style="padding: 1rem; display: none;">
						<!-- Progress Bar -->
						<div style="margin-bottom: 1rem;">
							<div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
								<span style="font-size: 0.85rem; color: var(--text-light);">Progress</span>
								<span id="floatProgress" style="font-size: 0.85rem; color: var(--primary-color); font-weight: 600;">0%</span>
							</div>
							<div style="background: rgba(0,0,0,0.3); height: 6px; border-radius: 3px; overflow: hidden;">
								<div id="floatProgressBar" style="background: linear-gradient(90deg, var(--primary-color), #06b6d4); height: 100%; width: 0%; transition: width 0.3s ease;"></div>
							</div>
						</div>

						<!-- File count -->
						<div style="font-size: 0.85rem; color: var(--text-light); margin-bottom: 1rem;">
							<span id="floatFileCount">0 of 0 files</span>
						</div>

						<!-- Cancel Button -->
						<button onclick="cancelUploadProcess()" style="width: 100%; padding: 0.65rem; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
							<i class="fas fa-times" aria-hidden="true"></i> Cancel Upload
						</button>
					</div>
				</div>
			</div>
		`;
		
		document.body.insertAdjacentHTML('beforeend', widgetHTML);
	}

	// Show floating widget
	window.showFloatingUpload = (fileName, fileCount) => {
		createFloatingWidget();
		const widget = document.getElementById('floatingUploadWidget');
		const fileNameEl = document.getElementById('floatFileName');
		const fileCountEl = document.getElementById('floatFileCount');
		
		if (fileNameEl) fileNameEl.textContent = fileName;
		if (fileCountEl) fileCountEl.textContent = `1 of ${fileCount} files`;
		if (widget) widget.style.display = 'block';
		
		// Auto-expand on show
		const content = document.getElementById('floatingContent');
		const toggleIcon = document.getElementById('floatToggleIcon');
		if (content) content.style.display = 'block';
		if (toggleIcon) toggleIcon.classList.remove('fa-chevron-down');
		if (toggleIcon) toggleIcon.classList.add('fa-chevron-up');
	};

	// Hide floating widget
	window.hideFloatingUpload = () => {
		const widget = document.getElementById('floatingUploadWidget');
		if (widget) widget.style.display = 'none';
	};

	// Update progress
	window.updateFloatingProgress = (fileName, current, total, percent) => {
		const fileNameEl = document.getElementById('floatFileName');
		const progressEl = document.getElementById('floatProgress');
		const progressBar = document.getElementById('floatProgressBar');
		const fileCountEl = document.getElementById('floatFileCount');
		
		if (fileNameEl) fileNameEl.textContent = fileName;
		if (progressEl) progressEl.textContent = `${percent}%`;
		if (progressBar) progressBar.style.width = `${percent}%`;
		if (fileCountEl) fileCountEl.textContent = `${current} of ${total} files`;
	};

	// Toggle collapse/expand
	window.toggleFloatingWidget = () => {
		const content = document.getElementById('floatingContent');
		const toggleIcon = document.getElementById('floatToggleIcon');
		
		if (content.style.display === 'none') {
			content.style.display = 'block';
			toggleIcon.classList.remove('fa-chevron-down');
			toggleIcon.classList.add('fa-chevron-up');
		} else {
			content.style.display = 'none';
			toggleIcon.classList.remove('fa-chevron-up');
			toggleIcon.classList.add('fa-chevron-down');
		}
	};

	// Cancel upload
	window.cancelUploadProcess = async () => {
		if (await showConfirm('Are you sure you want to cancel the upload?')) {
			window.uploadCancelled = true;
			hideFloatingUpload();
			showError('Upload cancelled');
		}
	};

	// Track upload state
	window.uploadCancelled = false;

	// Cleanup on page unload
	window.addEventListener('beforeunload', () => {
		window.uploadCancelled = false;
	});
})();

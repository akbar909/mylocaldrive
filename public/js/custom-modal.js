// Custom Modal System - Reusable modal dialogs for alerts and confirmations
(function() {
	let confirmResolve = null;

	// Create modal HTML if not exists - initializes modal structures in DOM
	function createModals() {
		if (document.getElementById('customModal')) return;
		
		const modalHTML = `
			<!-- Error/Success Modal -->
			<div id="customModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 9999; align-items: center; justify-content: center; height: 100vh;">
				<div id="modalContent" style="background: #111827; padding: 2rem; border-radius: 12px; max-width: 450px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.55);">
					<div style="display: flex; align-items: flex-start; gap: 1rem;">
						<i id="modalIcon" class="fas fa-exclamation-circle" style="font-size: 1.5rem; margin-top: 0.2rem; flex-shrink: 0;"></i>
						<div style="flex: 1;">
							<h3 id="modalTitle" style="margin: 0 0 0.75rem 0; color: var(--text-dark); font-size: 1.1rem;">Error</h3>
							<p id="modalMessage" style="margin: 0 0 1.5rem 0; color: var(--text-light); line-height: 1.5; font-size: 0.95rem;"></p>
							<button id="modalOkBtn" class="btn btn-primary" style="padding: 0.7rem 1.5rem; border: none; cursor: pointer;">OK</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Confirmation Modal -->
			<div id="customConfirmModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 9999; align-items: center; justify-content: center; height: 100vh;">
				<div style="background: #111827; padding: 2rem; border-radius: 12px; max-width: 450px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.55); border-left: 4px solid #f59e0b;">
					<div style="display: flex; align-items: flex-start; gap: 1rem;">
						<i class="fas fa-question-circle" style="font-size: 1.5rem; color: #f59e0b; margin-top: 0.2rem; flex-shrink: 0;"></i>
						<div style="flex: 1;">
							<h3 style="margin: 0 0 0.75rem 0; color: var(--text-dark); font-size: 1.1rem;">Confirmation Required</h3>
							<p id="confirmMessage" style="margin: 0 0 1.5rem 0; color: var(--text-light); line-height: 1.5; font-size: 0.95rem;"></p>
							<div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
								<button id="confirmCancelBtn" class="btn" style="padding: 0.7rem 1.4rem; background: var(--gray-700); border: none; color: white; border-radius: 8px; cursor: pointer;">Cancel</button>
								<button id="confirmOkBtn" class="btn btn-primary" style="padding: 0.7rem 1.4rem;">OK</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
		
		document.body.insertAdjacentHTML('beforeend', modalHTML);
		
		// Add event listeners
		document.getElementById('modalOkBtn')?.addEventListener('click', closeModal);
		document.getElementById('confirmOkBtn')?.addEventListener('click', () => handleConfirm(true));
		document.getElementById('confirmCancelBtn')?.addEventListener('click', () => handleConfirm(false));
	}

	// Show error modal
	window.showError = (message) => {
		createModals();
		const modal = document.getElementById('customModal');
		const content = document.getElementById('modalContent');
		const icon = document.getElementById('modalIcon');
		const title = document.getElementById('modalTitle');
		const messageEl = document.getElementById('modalMessage');
		
		if (content) content.style.borderLeft = '4px solid #ef4444';
		if (icon) {
			icon.className = 'fas fa-exclamation-circle';
			icon.style.color = '#ef4444';
		}
		if (title) title.textContent = 'Error';
		if (messageEl) messageEl.textContent = message;
		if (modal) modal.style.display = 'flex';
	};

	// Show success modal
	window.showSuccess = (message) => {
		createModals();
		const modal = document.getElementById('customModal');
		const content = document.getElementById('modalContent');
		const icon = document.getElementById('modalIcon');
		const title = document.getElementById('modalTitle');
		const messageEl = document.getElementById('modalMessage');
		
		if (content) content.style.borderLeft = '4px solid #10b981';
		if (icon) {
			icon.className = 'fas fa-check-circle';
			icon.style.color = '#10b981';
		}
		if (title) title.textContent = 'Success';
		if (messageEl) messageEl.textContent = message;
		if (modal) modal.style.display = 'flex';
	};

	// Show confirmation modal (returns promise)
	window.showConfirm = (message) => {
		createModals();
		const modal = document.getElementById('customConfirmModal');
		const messageEl = document.getElementById('confirmMessage');
		
		if (messageEl) messageEl.textContent = message;
		if (modal) modal.style.display = 'flex';
		
		return new Promise((resolve) => {
			confirmResolve = resolve;
		});
	};

	// Close modal
	window.closeModal = () => {
		const modal = document.getElementById('customModal');
		if (modal) modal.style.display = 'none';
	};

	// Handle confirmation result
	function handleConfirm(result) {
		const modal = document.getElementById('customConfirmModal');
		if (modal) modal.style.display = 'none';
		if (confirmResolve) {
			confirmResolve(result);
			confirmResolve = null;
		}
	}

	// Close on outside click
	document.addEventListener('click', (e) => {
		const modal = document.getElementById('customModal');
		const confirmModal = document.getElementById('customConfirmModal');
		if (e.target === modal) closeModal();
		if (e.target === confirmModal) handleConfirm(false);
	});

	// Close on Escape key
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			closeModal();
			handleConfirm(false);
		}
	});

	// Backwards compatibility
	window.closeErrorModal = closeModal;
})();

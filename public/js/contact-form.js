// Contact Form Handler - Handles form submission to backend Resend API
document.addEventListener('DOMContentLoaded', function() {
	const form = document.getElementById('contactForm');
	if (!form) return;

	const submitBtn = form.querySelector('button[type="submit"]');
	const feedback = document.getElementById('contactFeedback');
	let hideFeedbackTimer;

	const setLoading = (isLoading) => {
		if (!submitBtn) return;
		if (isLoading) {
			submitBtn.disabled = true;
			submitBtn.classList.add('btn-loading');
			submitBtn.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span><span>Sending...</span>';
		} else {
			submitBtn.disabled = false;
			submitBtn.classList.remove('btn-loading');
			submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
		}
	};

	const renderFeedback = (type, message) => {
		if (!feedback) return;
		clearTimeout(hideFeedbackTimer);
		feedback.innerHTML = '';
		feedback.classList.remove('is-success', 'is-error', 'is-visible');

		const icon = document.createElement('span');
		icon.className = 'form-feedback__icon';
		icon.innerHTML = type === 'success'
			? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
			: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

		const textWrap = document.createElement('div');
		const title = document.createElement('strong');
		title.textContent = type === 'success' ? 'Message sent' : 'Unable to send';
		const body = document.createElement('p');
		body.textContent = message;
		textWrap.appendChild(title);
		textWrap.appendChild(body);

		feedback.appendChild(icon);
		feedback.appendChild(textWrap);
		feedback.classList.add(type === 'success' ? 'is-success' : 'is-error', 'is-visible');

		hideFeedbackTimer = setTimeout(() => {
			feedback.classList.remove('is-visible');
		}, 2000);
	};

	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		const subject = form.querySelector('input[name="subject"]').value.trim();
		const message = form.querySelector('textarea[name="message"]').value.trim();

		if (!subject || !message) {
			renderFeedback('error', 'Please add both a subject and a message.');
			return;
		}

		setLoading(true);

		try {
			const response = await fetch('/contact/send', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include', // Send cookies with request
				body: JSON.stringify({ subject, message })
			});

			let data;
			try {
				data = await response.json();
			} catch (parseErr) {
				const text = await response.text();
				throw new Error(`HTTP ${response.status}: ${text?.slice(0,200) || 'Non-JSON response'}`);
			}

			if (response.ok && data.success) {
				renderFeedback('success', data.message || 'Your message has been sent to our team.');
				form.reset();
			} else {
				renderFeedback('error', data.error || data.message || `Request failed (${response.status})`);
			}
		} catch (error) {
			console.error('Contact form error:', error);
			renderFeedback('error', error?.message || 'Something went wrong. Please try again.');
		} finally {
			setLoading(false);
		}
	});
});

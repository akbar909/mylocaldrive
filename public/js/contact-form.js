// Contact Form Handler - Handles form submission to backend Resend API
document.addEventListener('DOMContentLoaded', function() {
	const form = document.getElementById('contactForm');
	if (!form) return;

	const submitBtn = form.querySelector('button[type="submit"]');

	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		const subject = form.querySelector('input[name="subject"]').value;
		const message = form.querySelector('textarea[name="message"]').value;
		const originalText = submitBtn.textContent;

		submitBtn.textContent = 'Sending...';
		submitBtn.disabled = true;

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
				alert('✅ Success! Your message has been sent to our team.');
				form.reset();
			} else {
				alert('❌ Error: ' + (data.error || data.message || `HTTP ${response.status}`));
			}
		} catch (error) {
			console.error('Contact form error:', error);
			alert(String(error?.message || error || '❌ Something went wrong. Please try again.'));
		} finally {
			submitBtn.textContent = originalText;
			submitBtn.disabled = false;
		}
	});
});

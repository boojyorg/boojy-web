/**
 * Boojy Hub - Email Signup (Mailchimp JSONP)
 */
const MAILCHIMP_URL = 'https://boojy.us7.list-manage.com/subscribe/post-json?u=2cebb535b536483a415022089&id=e7ebb28e0a&f_id=00bbafe0f0';

function initEmailSignup() {
    const form = document.getElementById('signup-form');
    const emailInput = document.getElementById('signup-email');
    const submitBtn = document.getElementById('signup-btn');
    const successDiv = document.getElementById('signup-success');
    const submittedEmail = document.getElementById('submitted-email');
    const description = document.getElementById('signup-description');

    if (!form || !emailInput) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        if (!email) return;

        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;

        try {
            const url = `${MAILCHIMP_URL}&EMAIL=${encodeURIComponent(email)}&c=mailchimpCallback`;

            window.mailchimpCallback = (response) => {
                if (response.result === 'success' || response.result === 'error') {
                    form.style.display = 'none';
                    description.style.display = 'none';
                    submittedEmail.textContent = email;
                    successDiv.style.display = 'block';
                }
                delete window.mailchimpCallback;
            };

            const script = document.createElement('script');
            script.src = url;
            document.body.appendChild(script);

            setTimeout(() => {
                if (window.mailchimpCallback) {
                    form.style.display = 'none';
                    description.style.display = 'none';
                    submittedEmail.textContent = email;
                    successDiv.style.display = 'block';
                    delete window.mailchimpCallback;
                }
            }, 2000);

        } catch (error) {
            console.error('Signup error:', error);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmailSignup);
} else {
    initEmailSignup();
}

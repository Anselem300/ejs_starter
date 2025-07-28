const toggle = document.getElementById('togglePassword');
const passwordInput = document.getElementById('account_password');

toggle.addEventListener('change', function () {
    passwordInput.type = this.checked ? 'text' : 'password';
  });

setTimeout(() => {
    const notice = document.querySelector('.notice');
    if (notice) {
      notice.classList.add('fade-out');
      setTimeout(() => notice.remove(), 1000); // Remove after fade
    }
  }, 30000); 

setTimeout(() => {
    const notice = document.querySelector('.error');
    if (notice) {
      notice.classList.add('fade-out');
      setTimeout(() => notice.remove(), 1000); // Remove after fade
    }
  }, 30000); 

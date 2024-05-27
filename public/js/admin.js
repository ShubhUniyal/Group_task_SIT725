const navbar = document.querySelector('.nav-bar');
let lastScrollTop = 0;

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
    if (scrollTop > lastScrollTop) {
      // Downscroll
      navbar.classList.add('hidden');
    } else {
      // Upscroll
      navbar.classList.remove('hidden');
    }
    lastScrollTop = scrollTop;
});
  
document.addEventListener('DOMContentLoaded', async () => {
  const currentThresholdValueSpan = document.getElementById('current-threshold-value');
  try {
      const response = await fetch('/api/threshold');
      const data = await response.json();
      if (response.ok) {
          currentThresholdValueSpan.textContent = data.value;
      } else {
          currentThresholdValueSpan.textContent = 'Failed to load';
      }
  } catch (error) {
      currentThresholdValueSpan.textContent = 'Error';
  }
});

function showThresholdForm() {
  const form = document.getElementById('threshold-form');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

async function updateThreshold(event) {
  event.preventDefault();
  const thresholdValue = document.getElementById('thresholdValue').value;

  try {
      const response = await fetch('/api/threshold', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ thresholdValue })
      });

      const data = await response.json();
      if (response.ok) {
          alert('Threshold value updated successfully');
          document.getElementById('current-threshold-value').textContent = thresholdValue;
      } else {
          alert('Failed to update threshold: ' + data.message);
      }
  } catch (error) {
      console.error('Error:', error);
      alert('Failed to update threshold: An unexpected error occurred.');
  }
}

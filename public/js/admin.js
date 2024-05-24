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
  

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  const sidebarContainer = document.querySelector('.sidebar-container');

  if (!sidebar || !sidebarContainer) {
    return;
  }

  const toggleButton = document.createElement('button');
  toggleButton.type = 'button';
  toggleButton.className = 'sidebar-toggle';
  toggleButton.setAttribute('aria-label', 'Open navigation menu');
  toggleButton.setAttribute('aria-expanded', 'false');
  toggleButton.innerHTML = '<span aria-hidden="true">☰</span><span>Menu</span>';

  const backdrop = document.createElement('div');
  backdrop.className = 'sidebar-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');

  document.body.appendChild(toggleButton);
  document.body.appendChild(backdrop);

  const closeSidebar = () => {
    document.body.classList.remove('sidebar-open');
    toggleButton.setAttribute('aria-expanded', 'false');
  };

  const openSidebar = () => {
    document.body.classList.add('sidebar-open');
    toggleButton.setAttribute('aria-expanded', 'true');
  };

  toggleButton.addEventListener('click', () => {
    if (document.body.classList.contains('sidebar-open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  backdrop.addEventListener('click', closeSidebar);

  sidebar.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      closeSidebar();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSidebar();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 767) {
      closeSidebar();
    }
  });
});
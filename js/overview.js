document.addEventListener('DOMContentLoaded', () => {
  const viewModeButtons = Array.from(document.querySelectorAll('.view-modes .view-mode-button'));
  const jarGrid = document.querySelector('.jar-grid');
  const jarSubtitle = document.querySelector('.jar-subtitle');

  // View data for different modes
  const viewModes = {
    day: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      subtitle: 'Each jar = one day of the week',
      featured: 'Mon'
    },
    week: {
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
      subtitle: 'Each jar = one week',
      featured: 'W1'
    },
    month: {
      labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      subtitle: 'Each jar = one month',
      featured: 'JAN'
    },
    year: {
      labels: ['2021', '2022', '2023', '2024', '2025', '2026'],
      subtitle: 'Each jar = one year',
      featured: '2024'
    }
  };

  function updateJarView(mode) {
    const data = viewModes[mode];
    
    // Update subtitle
    jarSubtitle.textContent = data.subtitle;
    
    // Update grid class for layout control
    jarGrid.className = `jar-grid view-${mode}`;
    
    // Clear and rebuild jar grid
    jarGrid.innerHTML = '';
    
    data.labels.forEach((label) => {
      const isFeatured = label === data.featured;
      const jarCard = document.createElement('div');
      jarCard.className = `jar-card ${isFeatured ? 'featured' : ''}`;
      jarCard.innerHTML = `
        <div class="jar"></div>
        <div class="jar-label ${isFeatured ? 'selected' : ''}">${label}</div>
      `;
      jarGrid.appendChild(jarCard);
    });
  }

  function setActiveButton(buttons, activeButton, activeClass) {
    buttons.forEach((button) => {
      button.classList.toggle(activeClass, button === activeButton);
      button.setAttribute('aria-pressed', String(button === activeButton));
    });
  }

  viewModeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.textContent.toLowerCase();
      setActiveButton(viewModeButtons, button, 'active');
      updateJarView(mode);
    });
  });

  // Set initial view to month
  updateJarView('month');
});

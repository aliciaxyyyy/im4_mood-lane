let monthlyData = [];

document.addEventListener('DOMContentLoaded', () => {
  // child selector: load kids from API and persist selection
  const childContainer = document.querySelector('.child-selector-container');

  async function loadChildren() {
    try {
      const resp = await fetch('api/get-kids.php');
      const data = await resp.json();
      const kids = data.kids || [];
      const selectedChildValue = localStorage.getItem('selectedChildId');

      // build buttons
      childContainer.innerHTML = '';

      kids.forEach((kid, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'child-button';
        const matchesStoredChipId = String(kid.chip_id) === String(selectedChildValue);
        const matchesStoredKidId = String(kid.id) === String(selectedChildValue);

        if (matchesStoredChipId || (!selectedChildValue && idx === 0)) {
          btn.classList.add('selected');
        }

        if (matchesStoredKidId && !matchesStoredChipId) {
          localStorage.setItem('selectedChildId', kid.chip_id);
          btn.classList.add('selected');
        }

        btn.dataset.id = kid.chip_id;
        btn.innerHTML = `<span class="child-name">${kid.name}</span>`;
        btn.addEventListener('click', () => {
          // set selection and update UI
          Array.from(childContainer.querySelectorAll('.child-button')).forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          localStorage.setItem('selectedChildId', kid.chip_id);
          localStorage.setItem('selectedChildName', kid.name);
        });
        childContainer.appendChild(btn);
      });

      // if no kids, keep existing static buttons
    } catch (err) {
      console.error('Failed loading kids', err);
    }
  }

  loadChildren();

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
    
    data.labels.forEach((label, index) => {
      const isFeatured = label === data.featured;
      const jarCard = document.createElement('div');
      jarCard.className = `jar-card ${isFeatured ? 'featured' : ''}`;
      jarCard.innerHTML = `
        <div class="jar jar-${index}"></div>
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


// -------- Add marbles to jars

// get all emotion entries
async function loadEmotionEntries() {
  try {
    const selectedChildId = localStorage.getItem('selectedChildId');
    if (!selectedChildId) return;

    const resp = await fetch(`api/get-entries.php?chip_id=${selectedChildId}`);
    const data = await resp.json();
    const entries = data.entries || [];
    console.log(data);
    
    // Process entries and add marbles to jars
    entries.forEach(entry => {
      let month = new Date(entry.created_at).getMonth(); // 0-11
      if (monthlyData[month]) {
        monthlyData[month].push(entry);
      } else {
        monthlyData[month] = [entry];
      }
    });

    console.log(monthlyData);
    
    monthlyData.forEach((entries, month) => {
      const jar = document.querySelector(`.jar-${month}`);
      console.log(`.jar-${month}`, jar);
      
      if (jar) {
        entries.forEach(entry => {
                // For simplicity, let's assume each entry has a 'mood' property that maps to a color
      const moodColorMap = {
        Freude: '#FFD700',
        Trauer: '#4A90E2',
        Wut: '#FF3333',
        Ekel: '#2ECC71',
        Angst: '#9B59B6',
        Stolz: '#f39512',
        Ueberraschung: '#ed3bd5',
        Neutral: '#c3c3c3'
      };
      const color = moodColorMap[entry.emotion] || '#000000';

      // Find the corresponding jar based on entry timestamp (for demo, we just add to the first jar)
      if (jar) {
        const marble = document.createElement('div');
        marble.className = 'marble';
        marble.style.backgroundColor = color;
        jar.appendChild(marble);
      }
        });
      }
    });
  } catch (err) {
    console.error('Failed loading emotion entries', err);
  }
}
loadEmotionEntries();
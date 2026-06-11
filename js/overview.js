document.addEventListener('DOMContentLoaded', () => {
  const childContainer = document.querySelector('.child-selector-container');
  const viewModeButtons = Array.from(document.querySelectorAll('.view-modes .view-mode-button'));
  const jarGrid = document.querySelector('.jar-grid');
  const jarSubtitle = document.querySelector('.jar-subtitle');
  const summaryContainer = document.querySelector('.summary');

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

  const state = {
    selectedChildId: localStorage.getItem('selectedChildId') || '',
    currentViewMode: 'month',
    entries: []
  };

  function parseDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function getIsoWeekInfo(date) {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNumber = utcDate.getUTCDay() || 7;
    utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNumber);
    const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7);

    return {
      weekYear: utcDate.getUTCFullYear(),
      weekNumber
    };
  }

  function getWeekStart(date) {
    const weekStart = new Date(date);
    const day = weekStart.getDay() || 7;
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - day + 1);
    return weekStart;
  }

  function formatDateParam(date) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-');
  }

  const viewModes = {
    day: {
      subtitle: 'Each jar = one day',
      maxBuckets: 14,
      getBucketKey: (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      getBucketLabel: (date) => date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      getBucketSortKey: (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(),
      getBucketRange: (date) => {
        const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const end = new Date(start);
        return { start, end };
      }
    },
    week: {
      subtitle: 'Each jar = one week',
      maxBuckets: 5,
      getBucketKey: (date) => {
        const { weekYear, weekNumber } = getIsoWeekInfo(date);
        return `${weekYear}-W${String(weekNumber).padStart(2, '0')}`;
      },
      getBucketLabel: (date) => {
        const { weekYear, weekNumber } = getIsoWeekInfo(date);
        return `W${String(weekNumber).padStart(2, '0')} ${weekYear}`;
      },
      getBucketSortKey: (date) => getWeekStart(date).getTime(),
      getBucketRange: (date) => {
        const start = getWeekStart(date);
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        return { start, end };
      }
    },
    month: {
      subtitle: 'Each jar = one month',
      maxBuckets: 12,
      getBucketKey: (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      getBucketLabel: (date) => `${date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()} ${date.getFullYear()}`,
      getBucketSortKey: (date) => new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
      getBucketRange: (date) => {
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return { start, end };
      }
    },
    year: {
      subtitle: 'Each jar = one year',
      getBucketKey: (date) => String(date.getFullYear()),
      getBucketLabel: (date) => String(date.getFullYear()),
      getBucketSortKey: (date) => new Date(date.getFullYear(), 0, 1).getTime(),
      getBucketRange: (date) => {
        const start = new Date(date.getFullYear(), 0, 1);
        const end = new Date(date.getFullYear(), 11, 31);
        return { start, end };
      }
    }
  };

  function setActiveButton(buttons, activeButton, activeClass) {
    buttons.forEach((button) => {
      const isActive = button === activeButton;
      button.classList.toggle(activeClass, isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  function renderSummary(buckets) {
    if (!summaryContainer) {
      return;
    }

    summaryContainer.innerHTML = '<h3>Summary</h3>';

    const summaryGrid = document.createElement('div');
    summaryGrid.className = 'summary-grid';

    const allEntries = buckets.flatMap((bucket) => bucket.entries);

    const emotionSummary = [
      { key: 'Freude', label: 'Freude', color: moodColorMap.Freude },
      { key: 'Wut', label: 'Wut', color: moodColorMap.Wut },
      { key: 'Trauer', label: 'Trauer', color: moodColorMap.Trauer },
      { key: 'Angst', label: 'Angst', color: moodColorMap.Angst },
      { key: 'Stolz', label: 'Stolz', color: moodColorMap.Stolz },
      { key: 'Ueberraschung', label: 'Ueberraschung', color: moodColorMap.Ueberraschung },
      { key: 'Ekel', label: 'Ekel', color: moodColorMap.Ekel },
      { key: 'Neutral', label: 'Neutral', color: moodColorMap.Neutral }
    ].map((emotion) => ({
      ...emotion,
      count: allEntries.filter((entry) => entry.emotion === emotion.key).length
    }));

    if (!allEntries.length) {
      const emptyState = document.createElement('p');
      emptyState.textContent = 'No balls in this time range yet.';
      summaryContainer.appendChild(emptyState);
      return;
    }

    emotionSummary.forEach((emotion) => {
      const card = document.createElement('article');
      card.className = 'summary-card';
      card.style.setProperty('--summary-accent', emotion.color);

      const ball = document.createElement('div');
      ball.className = 'summary-ball';
      ball.style.backgroundColor = emotion.color;
      ball.setAttribute('aria-hidden', 'true');

      const label = document.createElement('div');
      label.className = 'summary-emotion-label';
      label.textContent = emotion.label;

      const count = document.createElement('div');
      count.className = 'summary-emotion-count';
      count.textContent = String(emotion.count);

      card.appendChild(ball);
      card.appendChild(label);
      card.appendChild(count);
      summaryGrid.appendChild(card);
    });

    summaryContainer.appendChild(summaryGrid);
  }

  function renderEntries() {
    const config = viewModes[state.currentViewMode];
    const buckets = new Map();

    state.entries.forEach((entry) => {
      const date = parseDate(entry.created_at);
      if (!date) {
        return;
      }

      const bucketKey = config.getBucketKey(date);
      const existingBucket = buckets.get(bucketKey);

      if (existingBucket) {
        existingBucket.entries.push(entry);
        return;
      }

      buckets.set(bucketKey, {
        key: bucketKey,
        label: config.getBucketLabel(date),
        sortKey: config.getBucketSortKey(date),
        range: config.getBucketRange(date),
        entries: [entry]
      });
    });

    jarSubtitle.textContent = config.subtitle;
    jarGrid.className = `jar-grid view-${state.currentViewMode}`;
    jarGrid.innerHTML = '';

    const bucketList = Array.from(buckets.values()).sort((left, right) => left.sortKey - right.sortKey);
    const visibleBuckets = typeof config.maxBuckets === 'number'
      ? bucketList.slice(-config.maxBuckets)
      : bucketList;

    renderSummary(visibleBuckets);

    if (!visibleBuckets.length) {
      const emptyCard = document.createElement('div');
      emptyCard.className = 'jar-card featured';
      emptyCard.innerHTML = `
        <div class="jar"></div>
        <div class="jar-label selected">No data</div>
      `;
      jarGrid.appendChild(emptyCard);
      return;
    }

    jarGrid.dataset.viewMode = state.currentViewMode;

    visibleBuckets.forEach((bucket, index) => {
      const jarCard = document.createElement('div');
      jarCard.className = `jar-card ${index === 0 ? 'featured' : ''}`.trim();

      const jar = document.createElement('div');
      jar.className = `jar jar-${index}`;

      const jarScroll = document.createElement('div');
      jarScroll.className = 'jar-scroll';

      const sortedEntries = [...bucket.entries].sort((left, right) => {
        const leftDate = parseDate(left.created_at);
        const rightDate = parseDate(right.created_at);

        if (!leftDate && !rightDate) {
          return 0;
        }

        if (!leftDate) {
          return -1;
        }

        if (!rightDate) {
          return 1;
        }

        return leftDate.getTime() - rightDate.getTime();
      });

      sortedEntries.forEach((entry) => {
        const marble = document.createElement('div');
        marble.className = 'marble';
        marble.style.backgroundColor = moodColorMap[entry.emotion] || '#c3c3c3';
        marble.title = `${entry.emotion || 'Unknown'} - ${entry.created_at || ''}`;
        jarScroll.appendChild(marble);
      });

      jar.appendChild(jarScroll);

      const label = document.createElement('div');
      label.className = `jar-label ${index === 0 ? 'selected' : ''}`.trim();
      label.textContent = bucket.label;

      jarCard.appendChild(jar);
      jarCard.appendChild(label);

      jarCard.addEventListener('click', () => {
        if (!state.selectedChildId || !bucket.range) {
          return;
        }

        const params = new URLSearchParams({
          chip_id: String(state.selectedChildId),
          start_date: formatDateParam(bucket.range.start),
          end_date: formatDateParam(bucket.range.end)
        });

        window.location.href = `details.html?${params.toString()}`;
      });

      jarGrid.appendChild(jarCard);
    });
  }

  async function loadEntriesForChild(chipId) {
    if (!chipId) {
      state.entries = [];
      renderEntries();
      return;
    }

    try {
      const resp = await fetch(`api/get-entries.php?chip_id=${encodeURIComponent(chipId)}`);

      if (!resp.ok) {
        throw new Error(`Failed loading entries: ${resp.status}`);
      }

      const data = await resp.json();
      state.entries = Array.isArray(data.entries) ? data.entries : [];
      renderEntries();
    } catch (err) {
      console.error('Failed loading emotion entries', err);
      state.entries = [];
      renderEntries();
    }
  }

  function selectChild(kid, button) {
    Array.from(childContainer.querySelectorAll('.child-button')).forEach((childButton) => {
      childButton.classList.remove('selected');
    });

    button.classList.add('selected');
    state.selectedChildId = kid.chip_id;
    localStorage.setItem('selectedChildId', kid.chip_id);
    localStorage.setItem('selectedChildName', kid.name);
    loadEntriesForChild(kid.chip_id);
  }

  async function loadChildren() {
    try {
      const resp = await fetch('api/get-kids.php');

      if (!resp.ok) {
        throw new Error(`Failed loading kids: ${resp.status}`);
      }

      const data = await resp.json();
      const kids = Array.isArray(data.kids) ? data.kids : [];
      const selectedChildValue = localStorage.getItem('selectedChildId');

      childContainer.innerHTML = '';

      let selectedKid = null;

      kids.forEach((kid, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'child-button';
        button.dataset.id = kid.chip_id;
        button.innerHTML = `<span class="child-name">${kid.name}</span>`;

        const matchesStoredChipId = String(kid.chip_id) === String(selectedChildValue);
        const matchesStoredKidId = String(kid.id) === String(selectedChildValue);
        const shouldSelect = matchesStoredChipId || matchesStoredKidId || (!selectedChildValue && index === 0);

        if (shouldSelect) {
          button.classList.add('selected');
          selectedKid = kid;
        }

        if (matchesStoredKidId && !matchesStoredChipId) {
          localStorage.setItem('selectedChildId', kid.chip_id);
        }

        button.addEventListener('click', () => selectChild(kid, button));
        childContainer.appendChild(button);
      });

      if (!selectedKid && kids.length > 0) {
        selectedKid = kids[0];
        localStorage.setItem('selectedChildId', selectedKid.chip_id);
        localStorage.setItem('selectedChildName', selectedKid.name);

        const firstButton = childContainer.querySelector('.child-button');
        if (firstButton) {
          firstButton.classList.add('selected');
        }
      }

      if (selectedKid) {
        state.selectedChildId = selectedKid.chip_id;
        await loadEntriesForChild(selectedKid.chip_id);
      } else {
        state.entries = [];
        renderEntries();
      }
    } catch (err) {
      console.error('Failed loading kids', err);
      state.entries = [];
      renderEntries();
    }
  }

  viewModeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.textContent.trim().toLowerCase();
      state.currentViewMode = mode;
      setActiveButton(viewModeButtons, button, 'active');
      renderEntries();
    });
  });

  // Mobile swipe gesture handling for jar carousel
  let touchStartX = 0;
  let touchEndX = 0;
  const swipeThreshold = 50;

  jarGrid.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  jarGrid.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    const cardWidth = jarGrid.querySelector('.jar-card')?.offsetWidth || 0;

    if (Math.abs(diff) > swipeThreshold && cardWidth > 0) {
      // Swipe left: scroll right
      if (diff > 0) {
        jarGrid.scrollBy({ left: cardWidth + 16, behavior: 'smooth' });
      }
      // Swipe right: scroll left
      else {
        jarGrid.scrollBy({ left: -(cardWidth + 16), behavior: 'smooth' });
      }
    }
  }

  setActiveButton(viewModeButtons, viewModeButtons.find((button) => button.textContent.trim().toLowerCase() === 'month') || viewModeButtons[0], 'active');
  state.currentViewMode = 'month';
  loadChildren();
});
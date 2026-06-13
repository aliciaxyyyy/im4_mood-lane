// details.js - JavaScript code for the details.html page of the Mood Lane application. This script retrieves the chip ID and date range from the URL parameters, fetches the corresponding child name and emotion entries from the backend API, and updates the page with the relevant information, including an emotion radar chart and emotion breakdown bars.

// get chip id and start/end dates from url
const urlParams = new URLSearchParams(window.location.search);
const chipId = urlParams.get('chip_id');
const startDate = urlParams.get('start_date');
const endDate = urlParams.get('end_date');

document.getElementById("date-start").textContent = new Date(startDate).toLocaleDateString();
document.getElementById("date-end").textContent = new Date(endDate).toLocaleDateString();

// get child name
fetch("api/get-kids.php")
    .then(response => response.json())
    .then(data => {
        const child = data.kids.find(kid => kid.chip_id === chipId);
        if (child) {
            document.getElementById("child-name").textContent = child.name;
        }
    }) 
    .catch(error => {
        console.error("Error fetching child name:", error);
    });

// set start date to strart of day and end date to end of day for emotion entry fetch
const adjustedStartDate = new Date(startDate);
adjustedStartDate.setHours(0, 0, 0, 0);
const adjustedEndDate = new Date(endDate);
adjustedEndDate.setHours(23, 59, 59, 999);
let adjustedStartDateStr = adjustedStartDate.toISOString().slice(0, 19).replace('T', ' ');
let adjustedEndDateStr = adjustedEndDate.toISOString().slice(0, 19).replace('T', ' ');

// load emotions
fetch("api/get-entries-between-dates.php?chip_id=" + chipId + "&start_date=" + adjustedStartDateStr + "&end_date=" + adjustedEndDateStr)
    .then(response => response.json())
    .then(data => {

       console.log(data);

       let emotionEntries = data.entries || [];
       let happyCount = emotionEntries.filter(entry => entry.emotion === 'Freude').length;
       let sadCount = emotionEntries.filter(entry => entry.emotion === 'Trauer').length;
       let angryCount = emotionEntries.filter(entry => entry.emotion === 'Wut').length;
       let neutralCount = emotionEntries.filter(entry => entry.emotion === 'Neutral').length;
       let proudCount = emotionEntries.filter(entry => entry.emotion === 'Stolz').length;
       let surprisedCount = emotionEntries.filter(entry => entry.emotion === 'Ueberraschung').length;
       let disgustedCount = emotionEntries.filter(entry => entry.emotion === 'Ekel').length;
       let afraidCount = emotionEntries.filter(entry => entry.emotion === 'Angst').length;
         console.log(`Freude: ${happyCount}, Trauer: ${sadCount}, Wut: ${angryCount}, Neutral: ${neutralCount}, Stolz: ${proudCount}, Ueberraschung: ${surprisedCount}, Ekel: ${disgustedCount}, Angst: ${afraidCount}`);

            const totalSummaryCards = [
                { label: 'Happy', count: 37, color: '#FFD700' },
                { label: 'Angry', count: 33, color: '#FF3333' },
                { label: 'Sad', count: 29, color: '#4F8AD5' },
                { label: 'Anxious', count: 32, color: '#9B59B6' },
                { label: 'Calm', count: 34, color: '#38C76A' },
                { label: 'Neutral', count: 28, color: '#95A5A6' }
            ];
       
         // get highest emotion
         let topCount = Math.max(happyCount, sadCount, angryCount, neutralCount, proudCount, surprisedCount, disgustedCount, afraidCount);
        let totalCount = happyCount + sadCount + angryCount + neutralCount + proudCount + surprisedCount + disgustedCount + afraidCount;

                 // EMOTION RADAR CHART
                                 function drawRadarChart(labels, values) {
                                                const canvas = document.getElementById('emotion-radar');
                                                if (!canvas) return;
                                                const ctx = canvas.getContext('2d');
                                                const w = canvas.width;
                                                const h = canvas.height;
                                                ctx.clearRect(0, 0, w, h);
                                                const cx = w / 2;
                                                const cy = h / 2;
                                                const radius = Math.min(w, h) / 2 - 40;
                                                const maxVal = Math.max(...values, 1);
                                                const angleStep = (Math.PI * 2) / labels.length;

                                                const colorMap = {
                                                    Freude: '#FFD700',
                                                    Trauer: '#4A90E2',
                                                    Wut: '#FF3333',
                                                    Ekel: '#2ECC71',
                                                    Angst: '#9B59B6',
                                                    Stolz: '#f39512',
                                                    Ueberraschung: '#ed3bd5',
                                                    Neutral: '#c3c3c3'
                                                };

                                                function hexToRgba(hex, a) {
                                                    const h = hex.replace('#','');
                                                    const bigint = parseInt(h,16);
                                                    const r = (bigint >> 16) & 255;
                                                    const g = (bigint >> 8) & 255;
                                                    const b = bigint & 255;
                                                    return `rgba(${r},${g},${b},${a})`;
                                                }

                                                // precompute polygon points (data outline)
                                                const points = [];
                                                for (let i = 0; i < labels.length; i++) {
                                                    const val = values[i];
                                                    const ratio = val / maxVal;
                                                    const r = radius * ratio;
                                                    const ang = -Math.PI / 2 + i * angleStep;
                                                    const x = cx + Math.cos(ang) * r;
                                                    const y = cy + Math.sin(ang) * r;
                                                    points.push({ x, y });
                                                }

                                                // grid (concentric)
                                                ctx.strokeStyle = '#e6e6e6';
                                                ctx.lineWidth = 1;
                                                const levels = 4;
                                                for (let level = levels; level >= 1; level--) {
                                                        ctx.beginPath();
                                                        const r = radius * (level / levels);
                                                        for (let i = 0; i < labels.length; i++) {
                                                                const ang = -Math.PI / 2 + i * angleStep;
                                                                const x = cx + Math.cos(ang) * r;
                                                                const y = cy + Math.sin(ang) * r;
                                                                if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                                                        }
                                                        ctx.closePath();
                                                        ctx.stroke();
                                                }

                                                // axes and labels
                                                ctx.font = '12px sans-serif';
                                                for (let i = 0; i < labels.length; i++) {
                                                        const ang = -Math.PI / 2 + i * angleStep;
                                                        const x = cx + Math.cos(ang) * (radius + 18);
                                                        const y = cy + Math.sin(ang) * (radius + 18);
                                                        ctx.beginPath();
                                                        ctx.moveTo(cx, cy);
                                                        ctx.lineTo(cx + Math.cos(ang) * radius, cy + Math.sin(ang) * radius);
                                                        ctx.strokeStyle = '#f0f0f0';
                                                        ctx.stroke();
                                                        const label = labels[i];
                                                        ctx.fillStyle = '#222';
                                                        ctx.fillText(label, x - (label.length * 3), y + 4);
                                                }

                                                // fill sectors: for each edge between point i and i+1, split at midpoint
                                                const n = labels.length;
                                                for (let i = 0; i < n; i++) {
                                                    const next = (i + 1) % n;
                                                    const p1 = points[i];
                                                    const p2 = points[next];
                                                    const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

                                                    // left half (near p1) colored by labels[i]
                                                    ctx.beginPath();
                                                    ctx.moveTo(cx, cy);
                                                    ctx.lineTo(p1.x, p1.y);
                                                    ctx.lineTo(mid.x, mid.y);
                                                    ctx.closePath();
                                                    const leftColor = colorMap[labels[i]] || '#999';
                                                    ctx.fillStyle = hexToRgba(leftColor, 0.4);
                                                    ctx.fill();

                                                    // right half (near p2) colored by labels[next]
                                                    ctx.beginPath();
                                                    ctx.moveTo(cx, cy);
                                                    ctx.lineTo(mid.x, mid.y);
                                                    ctx.lineTo(p2.x, p2.y);
                                                    ctx.closePath();
                                                    const rightColor = colorMap[labels[next]] || '#999';
                                                    ctx.fillStyle = hexToRgba(rightColor, 0.4);
                                                    ctx.fill();
                                                }

                                                // outline (data polygon)
                                                ctx.beginPath();
                                                for (let i = 0; i < n; i++) {
                                                    const p = points[i];
                                                    if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
                                                }
                                                ctx.closePath();
                                                ctx.strokeStyle = 'rgba(0,0,0,0.6)';
                                                ctx.lineWidth = 2;
                                                ctx.stroke();

                                                // markers
                                                for (let i = 0; i < n; i++) {
                                                    const p = points[i];
                                                    const color = colorMap[labels[i]] || '#666';
                                                    ctx.beginPath();
                                                    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
                                                    ctx.fillStyle = color;
                                                    ctx.fill();
                                                    ctx.lineWidth = 1;
                                                    ctx.strokeStyle = '#fff';
                                                    ctx.stroke();
                                                }
                                        }

                    const labels = ['Freude','Trauer','Wut','Angst','Ueberraschung','Ekel','Stolz','Neutral'];
                    const values = [happyCount, sadCount, angryCount, afraidCount, surprisedCount, disgustedCount, proudCount, neutralCount];
                    drawRadarChart(labels, values);

         // EMOTION BREAKDOWN
            document.querySelector(".emotion-bar.happy .emotion-percentage").textContent = happyCount + " (" + ((happyCount / totalCount) * 100).toFixed(1) + "%)";
            document.querySelector(".emotion-bar.sad .emotion-percentage").textContent = sadCount + " (" + ((sadCount / totalCount) * 100).toFixed(1) + "%)";
            document.querySelector(".emotion-bar.angry .emotion-percentage").textContent = angryCount + " (" + ((angryCount / totalCount) * 100).toFixed(1) + "%)";
            document.querySelector(".emotion-bar.neutral .emotion-percentage").textContent = neutralCount + " (" + ((neutralCount / totalCount) * 100).toFixed(1) + "%)";
            document.querySelector(".emotion-bar.proud .emotion-percentage").textContent = proudCount + " (" + ((proudCount / totalCount) * 100).toFixed(1) + "%)";
            document.querySelector(".emotion-bar.surprised .emotion-percentage").textContent = surprisedCount + " (" + ((surprisedCount / totalCount) * 100).toFixed(1) + "%)";
            document.querySelector(".emotion-bar.disgusted .emotion-percentage").textContent = disgustedCount + " (" + ((disgustedCount / totalCount) * 100).toFixed(1) + "%)";
            document.querySelector(".emotion-bar.afraid .emotion-percentage").textContent = afraidCount + " (" + ((afraidCount / totalCount) * 100).toFixed(1) + "%)";

            document.querySelector(".emotion-bar.happy .fill"). style.width = ((happyCount / totalCount) * 100).toFixed(1) + "%";
            document.querySelector(".emotion-bar.sad .fill"). style.width = ((sadCount / totalCount) * 100).toFixed(1) + "%";
            document.querySelector(".emotion-bar.angry .fill"). style.width = ((angryCount / totalCount) * 100).toFixed(1) + "%";
            document.querySelector(".emotion-bar.neutral .fill"). style.width = ((neutralCount / totalCount) * 100).toFixed(1) + "%";
            document.querySelector(".emotion-bar.proud .fill"). style.width = ((proudCount / totalCount) * 100).toFixed(1) + "%";
            document.querySelector(".emotion-bar.surprised .fill"). style.width = ((surprisedCount / totalCount) * 100).toFixed(1) + "%";
            document.querySelector(".emotion-bar.disgusted .fill"). style.width = ((disgustedCount / totalCount) * 100).toFixed(1) + "%";
            document.querySelector(".emotion-bar.afraid .fill"). style.width = ((afraidCount / totalCount) * 100).toFixed(1) + "%";

            // entry count
            document.getElementById("entry-count").textContent = totalCount;
    }) 
    .catch(error => {
        console.error("Error during unload:", error);
    });

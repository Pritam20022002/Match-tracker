const API_URL = 'https://api.cricapi.com/v1/cricScore?apikey=PASTEanAPIkeyFROMcricapi';
const matchesContainer = document.getElementById('matches-container');
const buttons = document.querySelectorAll('nav button');


function fetchMatches(msValue) {
  matchesContainer.innerHTML = '<span style="color: white;">Loading...</span>'; // Show loading text
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.data) {
        const filteredMatches = data.data.filter((match) => match.ms === msValue);
        displayMatches(filteredMatches);
      } else {
      matchesContainer.innerHTML = '<span style="color: white;">Free information has expired, renewing soon</span>';
      }
    })
    .catch(() => {
      matchesContainer.innerHTML = 'Error fetching data.';
    });
}




function displayMatches(matches) {
  matchesContainer.innerHTML = '';
  if (matches.length === 0) {
    matchesContainer.innerHTML = 'No matches found.';
    return;
  }
  matches.forEach((match) => {
    const matchDate = new Date(match.dateTimeGMT);
    matchDate.setHours(matchDate.getHours() + 5); 
    matchDate.setMinutes(matchDate.getMinutes() + 30); 
    const formattedDate = matchDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    const matchBox = document.createElement('div');
    matchBox.className = 'match-box';
    matchBox.innerHTML = `
      <div class="match-header">
        <span>${match.series}</span>
      </div>
      <div class="team">
        <img src="${match.t1img}" alt="${match.t1}">
        <span>${match.t1}</span>
        <span class="team-score">${match.t1s || ''}</span>
      </div>
      <div class="team">
        <img src="${match.t2img}" alt="${match.t2}">
        <span>${match.t2}</span>
        <span class="team-score">${match.t2s || ''}</span>
      </div>
      <div class="match-info">
        <p style="text-transform: uppercase; font-weight: bold;">${match.matchType} </p>
        <p> ${match.status}</p>
        <p><strong>Date:</strong> ${formattedDate}</p> <!-- Match Date -->
      </div>
    `;
    matchesContainer.appendChild(matchBox);
  });
}


buttons.forEach((button) => {
  button.addEventListener('click', () => {
    buttons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    const msValue = button.id === 'past' ? 'result' : button.id === 'live' ? 'live' : 'fixture';
    fetchMatches(msValue);
  });
});


fetchMatches('live');

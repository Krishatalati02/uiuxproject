// Data for available foods
const foodsData = [
  { name: 'Vegan Pasta', expiry: '2025-10-03', image: 'assets/veg4.jpg' },
  { name: 'Veg Stuffed Peppers', expiry: '2025-10-04', image: 'assets/veg2.jpg' },
  { name: 'Paneer Tikka', expiry: '2025-10-05', image: 'assets/veg3.jpg' },
  { name: 'Chickpea Salad', expiry: '2025-10-03', image: 'assets/veg1.jpg' },
  { name: 'Vegetable Biryani', expiry: '2025-10-06', image: 'assets/veg5.jpg' },
];

// Render cards on foods.html
function renderFoods(arr) {
  const container = document.getElementById('foodCards');
  if(!container) return;
  
  container.innerHTML = '';
  arr.forEach(food => {
    const card = document.createElement('div');
    card.className = 'col-md-4';
    card.innerHTML = `
      <div class="card shadow-sm">
        <img src="${food.image}" alt="${food.name}" class="card-img-top" style="height:240px; object-fit:cover;" />
        <div class="card-body d-flex flex-column justify-content-between">
          <h5 class="card-title">${food.name}</h5>
          <p class="card-text text-muted">Expiry: ${food.expiry}</p>
          <a href="#" class="btn btn-danger mt-auto">View Details</a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

if(document.getElementById('foodCards')) {
  renderFoods(foodsData);

  // Event handlers for search and filter
  document.getElementById('searchInput').addEventListener('input', filterSortFoods);
  document.getElementById('sortSelect').addEventListener('change', filterSortFoods);
  document.getElementById('filterSelect').addEventListener('change', filterSortFoods);

  function filterSortFoods() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const sortVal = document.getElementById('sortSelect').value;
    const filterVal = document.getElementById('filterSelect').value;

    const todayISO = new Date().toISOString().slice(0, 10);
    const tomorrowISO = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

    let filtered = foodsData.filter(food => food.name.toLowerCase().includes(q));

    if(filterVal === 'today') {
      filtered = filtered.filter(food => food.expiry === todayISO);
    } else if(filterVal === 'tomorrow') {
      filtered = filtered.filter(food => food.expiry === tomorrowISO);
    }

    filtered.sort((a,b) => {
      if(sortVal === 'expiry-asc') return a.expiry.localeCompare(b.expiry);
      else return b.expiry.localeCompare(a.expiry);
    });

    renderFoods(filtered);
  }
}
// ----- Inside the loop that builds a card (example) -----
const card = `
  <div class="col-md-6 col-lg-4">
    <div class="card food-card h-100 shadow-sm">
      <img src="${food.img}" class="card-img-top" alt="${food.name}" style="height:180px; object-fit:cover;">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${food.name}</h5>
        <p class="card-text text-muted small">Qty: ${food.qty} | Expires: ${food.expiry}</p>
        <button class="btn btn-outline-primary mt-auto view-details-btn" data-food='${JSON.stringify(food)}'>
          View Details
        </button>
      </div>
    </div>
  </div>`;
foodCards.innerHTML += card;
// ==== MODAL HANDLER (add at the end of script.js) ====
document.addEventListener('click', e => {
  if (e.target.matches('.view-details-btn')) {
    const food = JSON.parse(e.target.dataset.food);

    // ---- Fill modal ----
    document.getElementById('modalFoodName').textContent   = food.name;
    document.getElementById('modalFoodImg').src           = food.img;
    document.getElementById('modalQty').textContent       = food.qty;
    document.getElementById('modalExpiry').textContent    = food.expiry;
    document.getElementById('modalPosted').textContent    = food.posted || '—';
    document.getElementById('modalDesc').textContent      = food.description || 'No description provided.';

    // Donor info (adjust keys to match your data)
    document.getElementById('modalDonorName').textContent = food.donor?.name   || 'Anonymous';
    document.getElementById('modalDonorPhone').href       = `tel:${food.donor?.phone || ''}`;
    document.getElementById('modalDonorPhone').textContent= food.donor?.phone || '—';
    document.getElementById('modalDonorEmail').href       = `mailto:${food.donor?.email || ''}`;
    document.getElementById('modalDonorEmail').textContent= food.donor?.email || '—';

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('foodDetailModal'));
    modal.show();
  }
});

/* Optional: Claim button – you can hook your own logic */
document.getElementById('modalClaimBtn')?.addEventListener('click', () => {
  alert('Claim logic goes here! (e.g. send request to backend)');
});
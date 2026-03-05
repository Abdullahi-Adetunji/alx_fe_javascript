const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API endpoint
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" }
];

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverQuotes = await response.json();
    
    // Map server data to our quote structure (since mock API uses different keys)
    return serverQuotes.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

// Function to post a new quote to the server (Simulation)
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });
    return await response.json();
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}

// Periodic Syncing: Fetches server data and handles conflict resolution
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  
  // Simple Conflict Resolution: Server data takes precedence
  // We check if any server quote is not in our local list
  let updated = false;
  serverQuotes.forEach(serverQuote => {
    const exists = quotes.some(localQuote => localQuote.text === serverQuote.text);
    if (!exists) {
      quotes.push(serverQuote);
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
    showSyncNotification("Quotes synced with server!"); // Step 3
  }
}

// Handling Conflicts & UI Notifications 

function showSyncNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed; bottom: 20px; right: 20px; 
    background: #4CAF50; color: white; padding: 15px; 
    border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 1000;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => notification.remove(), 3000);
}

// CORE FUNCTIONALITY (Updated for Sync) 

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

async function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    
    // Sync to server immediately
    await postQuoteToServer(newQuote);
    
    textInput.value = '';
    categoryInput.value = '';
    alert("Quote added locally and synced to server!");
  }
}

// UI & INITIALIZATION 

function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat; opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastSelectedCategory', selected);
  const display = document.getElementById('quoteDisplay');
  const filtered = selected === 'all' ? quotes : quotes.filter(q => q.category === selected);
  
  if (filtered.length > 0) {
    const q = filtered[Math.floor(Math.random() * filtered.length)];
    display.innerHTML = `<p>"${q.text}"</p><p><em>Category: ${q.category}</em></p>`;
  }
}

document.getElementById('newQuote').addEventListener('click', filterQuotes);

// Initialize everything
populateCategories();
filterQuotes();

// SET UP PERIODIC SYNC (Every 1 minute)
setInterval(syncQuotes, 60000);
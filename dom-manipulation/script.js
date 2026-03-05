let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
  { text: "Stay hungry, stay foolish.", category: "Inspiration" }
];

// Populate Categories Dynamically
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  
  // Extract unique categories using Map or Set
  const categories = quotes.map(quote => quote.category);
  const uniqueCategories = [...new Set(categories)];

  // Clear existing options except "All Categories"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Append unique categories to the dropdown
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore the last selected filter from Local Storage
  const lastFilter = localStorage.getItem('lastSelectedCategory') || 'all';
  categoryFilter.value = lastFilter;
}

// Filter Quotes Based on Selected Category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  // Save selection to Local Storage
  localStorage.setItem('lastSelectedCategory', selectedCategory);

  // Filter the array
  const filteredQuotes = selectedCategory === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.category === selectedCategory);

  // Display the first quote from the filtered list (if available)
  if (filteredQuotes.length > 0) {
    const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><em>Category: ${quote.category}</em></p>`;
  } else {
    quoteDisplay.innerHTML = `<p>No quotes found for this category.</p>`;
  }
}

function showRandomQuote() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = selectedCategory === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.category === selectedCategory);

  if (filteredQuotes.length > 0) {
    const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    document.getElementById('quoteDisplay').innerHTML = `<p>"${quote.text}"</p><p><em>Category: ${quote.category}</em></p>`;
  }
}

// Updated Add Quote Function
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    localStorage.setItem('quotes', JSON.stringify(quotes));
    
    // Update categories dropdown if a new one is added
    populateCategories();
    
    textInput.value = '';
    categoryInput.value = '';
    alert("Quote added successfully!");
  }
}

// Import/Export and Initialization remains consistent 

function exportToJson() {
  const dataStr = JSON.stringify(quotes);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  link.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    localStorage.setItem('quotes', JSON.stringify(quotes));
    populateCategories(); // Refresh categories after import
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

function createAddQuoteForm() {
  const formContainer = document.getElementById('formContainer');
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('exportQuotes').addEventListener('click', exportToJson);

// Initialize the app
populateCategories();
createAddQuoteForm();
filterQuotes();
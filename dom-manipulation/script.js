// Initialize quotes array
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
  { text: "Stay hungry, stay foolish.", category: "Inspiration" }
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  // Pick a random index from the array
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Update the DOM with the quote and category
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><em>Category: ${quote.category}</em></p>`;
}

// Function to create the add quote form dynamically
function createAddQuoteForm() {
  const formContainer = document.getElementById('formContainer');

  // Create input for quote text
  const quoteInput = document.createElement('input');
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  // Create input for quote category
  const categoryInput = document.createElement('input');
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  // Create add button
  const addButton = document.createElement('button');
  addButton.textContent = "Add Quote";
  
  // Attach the addQuote function to the button
  addButton.addEventListener('click', addQuote);

  // Append elements to the container
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// Function to add a new quote to the array and update the UI
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value;
  const quoteCategory = document.getElementById('newQuoteCategory').value;

  if (quoteText && quoteCategory) {
    // Add the new quote object to the array
    quotes.push({ text: quoteText, category: quoteCategory });

    // Clear the input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    alert("Quote added successfully!");
  } else {
    alert("Please fill in both the quote and the category.");
  }
}

// Attach event listener to the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initialize the app by creating the form on page load
createAddQuoteForm();
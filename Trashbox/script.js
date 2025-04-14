document.addEventListener('DOMContentLoaded', () => {
  const searchBar = document.getElementById('searchBar');
  const trashButton = document.querySelector('.btn.danger');

  // Handle search bar input
  searchBar.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    console.log(`Searching for: ${query}`);
    // Add logic to filter items in the trash box based on the query
  });

  // Handle trash button click
  trashButton.addEventListener('click', () => {
    console.log('Trash button clicked');
    // Add logic to handle trash button actions
  });
});
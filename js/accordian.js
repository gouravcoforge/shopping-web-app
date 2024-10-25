    document.querySelectorAll('.accordion-header').forEach(header => {
header.addEventListener('click', () => {
    // Toggle the active class on the clicked header
    header.classList.toggle('active');

    // Toggle the corresponding content display
    const content = header.nextElementSibling;
    if (content.style.display === 'block') {
        content.style.display = 'none';
    } else {
        content.style.display = 'block';
    }
});
});

document.getElementById('checkout-btn').addEventListener('click', () => {
// Perform checkout logic (e.g., form validation, submission)
alert('Proceeding to checkout!');
});
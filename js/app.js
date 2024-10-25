let allProducts = [];
let currentProducts = [];
let searchedInput = ""; 
let filters = {
    categories: [],
    sort: null
  };
 
  window.addEventListener('DOMContentLoaded', () => {
    loadHomePage();
  });
 
function setupFiltersAndSorting() {
    document.getElementById('filter-form').addEventListener('change', applyFilters);
    // document.getElementById('sort-price').addEventListener('change', applySorting);
  }
 
// Load Home/Product List Page
function loadHomePage() {
  const mainContent = document.getElementById('product-list');
  mainContent.innerHTML = '<div class="loading">Loading products...</div>';
 
  try {
    fetchProducts().then(products => {
      console.log({ products });
      allProducts = [...products];
      renderProducts();
      renderForm();
    });
  } catch(error) {
    renderError(error);
  }
}
 
function renderProducts(pageNumber) {
  const contentArea = document.getElementById('product-list');
  let filteredProducts = applyCategoryFilters();
  filteredProducts = sortProducts(filteredProducts);
  filteredProducts = getFilteredProductsAfterSearch(filteredProducts, searchedInput);
  
  displayedProducts = [...filteredProducts];
 
  if (pageNumber) {
    let startIdx = (pageNumber - 1) * 6;
    let endIdx = startIdx + 6;
    filteredProducts = filteredProducts.slice(startIdx, endIdx);
  }
 
  let productCardsHTML = filteredProducts.slice(0, 6).map(product => `
    <div class="product-items" onclick="loadProductDetails(${product.id})">
      <img src="${product.image}" alt="${product.title}" loading="lazy">
      <h3>${product.title}</h3>
      <p>$${product.price}</p>
      <i class="fa-regular fa-heart" onclick="addToWishlist(${product.id})"></i>
    </div>
  `).join('');
 
  contentArea.innerHTML = productCardsHTML;
  addFooterHrNewMargin(7);
  setTotalCount();
  setupPagination(displayedProducts, pageNumber);
  
};
 
  function applyCategoryFilters() {
    if (filters.categories.length > 0) {
      return allProducts.filter(product => filters.categories.includes(product.category));
    }
    return allProducts;
  }
 
  // Apply Sorting (Ascending or Descending)
  function getProductsAfterSorting(products) {
    console.log("applySorting")
    const sortValue = filters.sort;
    console.log({ sortValue })
    if (sortValue === 'asc') {
      return products.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'desc') {
      return products.sort((a, b) => b.price - a.price);
    }
 
    return products; // No sorting applied
  }
 
  // Handle Filter Changes
  function applyFilters() {
    console.log("applyFilters")
 
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
      .map(checkbox => checkbox.value);
 
    filters.categories = selectedCategories;
 
    // Reload products based on the new filters
      renderProducts();
  }
 
  // Handle Sorting Changes
  function applySorting() {
    console.log("applySorting")
    const selectedSort = document.getElementById('sort-price').value;
    filters.sort = selectedSort;
 
    // Reload products based on the new sorting
    renderProducts();
  }
 
// Load Product Details Page
window.loadProductDetails = function(productId) {
  resetProductsListPageBeforeLoadingProductDetails();
  const product = getProductById(productId);
  console.log({ product })
  const productCardDetails = document.getElementById('product-card-details');
  
  const leftSideImages = document.createElement("div");
  leftSideImages.classList.add("img");
 
  let productThumbnailsHTML = new Array(5).fill("").map((e, i) => `
  <img src="${product.image}" alt="${product.title}" class="${!i ? 'product-first-thumbnail' : ''}">
`).join('');
  leftSideImages.innerHTML = `${productThumbnailsHTML}`;
 
  const rightSideImageDiv = document.createElement("div");
  rightSideImageDiv.classList.add("left");
  const rightSideImage = document.createElement("img");
  rightSideImage.setAttribute("src", product.image);
  rightSideImageDiv.append(rightSideImage);
  productCardDetails.append(leftSideImages);
  productCardDetails.append(rightSideImageDiv);
  
  const rightDiv = document.createElement("div");
  rightDiv.classList.add("right");
  
  const productDetails = `
    <h6>Clothing / ${product.category} / OuterWear</h6>
        <h2>${product.title}</h2>
        <h2 class="product-head">$${product.price}</h2>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-regular fa-star"></i> <span>(175)</span>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. <br>Dolorum nulla iste dolores beatae cum modi. <a href="#">Read More</a></p>
        <hr>
        <h4>Quantity</h4>
        <button id="decrease" class="btn-incrs">-</button>
        <input type="number" id="quantity" value="1" min="1" max="10" class="btn-set">
        <button id="increase" class="btn-incrs">+</button> <br>
        <button id="add-to-cart-btn" class="add-btn">Add To Cart</button>
        <div class="share">
            <i class="fa-regular fa-heart"></i> Save  &nbsp;.
            <i class="fa-solid fa-share-nodes"></i> Share
        </div>
  `;
  const pageBanner = document.getElementById("page-banner");
  pageBanner.style.display = "none";
 
  rightDiv.innerHTML = productDetails;
  productCardDetails.append(rightDiv);
 
  const productDetailsContent = document.getElementById("product-card-content");
  const productTitle = document.createElement("h2")
  productTitle.classList.add("content-1");
  productTitle.innerText = product.title;
  const productDescHeading = document.createElement("h4")
  productDescHeading.classList.add("content-2");
  productDescHeading.innerText = "Description";
  const description = document.createElement("p")
  description.classList.add("content-3");
  description.innerText = product.description;
  productDetailsContent.append(productTitle);
  productDetailsContent.append(productDescHeading);
  productDetailsContent.append(description);
  addFooterHrNewMargin(13);

  // Add event listeners for quantity buttons
  setupQuantityButtons();
  document.getElementById('add-to-cart-btn').addEventListener('click', () => {
    const quantity = parseInt(document.getElementById('quantity').value);
    addToCart(product, quantity);
    window.location.href = './cart.html';
  });
}
 
function setupQuantityButtons() {
    const increaseBtn = document.getElementById('increase');
    const decreaseBtn = document.getElementById('decrease');
    const quantityInput = document.getElementById('quantity');
 
    // Increase quantity
    increaseBtn.addEventListener('click', () => {
      let currentValue = parseInt(quantityInput.value);
      if (currentValue < 10) {
        quantityInput.value = currentValue + 1;
      }
    });
 
    // Decrease quantity
    decreaseBtn.addEventListener('click', () => {
      let currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });
  }
 
// Pagination Setup
function setupPagination(productsList, currentPage = 1) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";
 
  let totalPages = Math.ceil(productsList.length / 6);
 
  const prevArrow = document.createElement('a');
  prevArrow.textContent = '<';
  prevArrow.classList.add('prev-arrow');
 
  if (currentPage === 1) {
    prevArrow.style.visibility = 'hidden'; // Hide if on the first page
  } else {
    prevArrow.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderProducts(currentPage);
      }
    });
  }
 
  paginationContainer.appendChild(prevArrow);
 
  for (let i = 1; i <= totalPages; i++) {
    let pageLink = document.createElement('a');
    pageLink.textContent = i;
    if (i === currentPage) {
      pageLink.classList.add('active'); // Mark the current page as active
    }
    pageLink.addEventListener('click', () => renderProducts(i));
    paginationContainer.appendChild(pageLink);
  }
 
  const nextArrow = document.createElement('a');
  nextArrow.textContent = '>'; // You can replace this with an icon if needed
  nextArrow.classList.add('next-arrow');
  if (currentPage === totalPages) {
    nextArrow.style.visibility = 'hidden'; // Hide if on the last page
  }
  nextArrow.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderProducts(currentPage);
    }
  });
  paginationContainer.appendChild(nextArrow);
}
 
 
 
// Function to render the form dynamically
function renderForm() {
  const filterBox = document.createElement("div");
  filterBox.classList.add("filterbox");
  
  // Create h5 element
  const h5 = document.createElement("h5");
  h5.textContent = "Clothing / Women's / Outerwear";
  
  // Create h4 element for Filters heading
  const h4Filters = document.createElement("h4");
  h4Filters.textContent = "Filters";
  
  // Create hr (horizontal rule)
  const hr = document.createElement("hr");
  hr.classList.add("product-linees");
  
  // Create div for category list
  const categoryList = document.createElement("div");
  categoryList.classList.add("CategoryList");
  
  // Create h4 element for Categories heading
  const h4Categories = document.createElement("h4");
  h4Categories.textContent = "Categories";
 
  const form = document.createElement("form");
  form.setAttribute('id', "filter-form");

   // Create hr (horizontal rule)
  const hr1 = document.createElement("hr");
  hr1.classList.add("product-linees");
  
  // Array of categories
  const categories = [
    { value: "men's clothing", label: "Men's Clothing" },
    { value: "jewelery", label: "Jewellery" },
    { value: "electronics", label: "Electronics" },
    { value: "women's clothing", label: "Women's Clothing" }
  ];
  
  categories.forEach(category => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'category';
    checkbox.value = category.value;
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(` ${category.label}`));
    categoryList.appendChild(label);
  });
 
  form.append(categoryList);
 
 
  // Append all created elements to filterBox
  filterBox.appendChild(h5);
  filterBox.appendChild(h4Filters);
  filterBox.appendChild(hr);
  filterBox.appendChild(form);
  categoryList.insertBefore(h4Categories, categoryList.firstChild);
  filterBox.appendChild(hr1);
   
  // Finally, append the filterBox to the container in the DOM
  document.getElementById("filters").append(filterBox);
  setupFiltersAndSorting();
};
 
 
function resetProductsListPageBeforeLoadingProductDetails() {
  const productList = document.getElementById('product-list');
  const filtersDiv = document.getElementById('filters');
  const paginationDiv = document.getElementById('pagination');
  productList.innerHTML = "";
  filtersDiv.innerHTML = "";
  paginationDiv.innerHTML = "";
}

function onChangeSearch(event) {
  searchedInput = event.target.value.toLowerCase();
  console.log({ searchedInput });
  renderProducts();
};
 
function onChangeSorting(event) {
  console.log({ event })
  const sortOption = event.target.value;
  filters = {
    ...filters,
    sortBy: sortOption
  };
  renderProducts();
}
 
function setTotalCount() {
  const resultDivRef = document.getElementById("results-count");
  resultDivRef.innerHTML = `${displayedProducts.length} results`;
}

function sortProducts(products) {
  const sortingCriteria = filters.sortBy;
  if (sortingCriteria === 'asc') {
    return products.sort((a, b) => a.price - b.price);
  } else if (sortingCriteria === 'desc') {
    return products.sort((a, b) => b.price - a.price);
  }
  return products;
}

function getFilteredProductsAfterSearch(products, searchInput) {
  return products.filter(product =>
    product.title.toLowerCase().includes(searchInput) ||
    product.category.toLowerCase().includes(searchInput)
);
}

function addFooterHrNewMargin(newValue) {
  const footerHr = document.getElementById("footer-hr");
  footerHr.style.marginTop = `${newValue}%`;
};

function renderError({ message = "" }) {
  const contentArea = document.getElementById('product-list');
  contentArea.innerHTML = `${message} || "Something went wrong"`;
}
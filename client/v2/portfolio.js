// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api\d2l\home
GET https://clear-fashion-api.vercel.app/

Search for specific products

This endpoint accepts the following optional query string parameters:

- `page` - page of products to return
- `size` - number of products to return

GET https://clear-fashion-api.vercel.app/brands

Search for available brands list
*/

// current products on the page
let currentProducts = [];
let favoriteProducts = [];
let currentPagination = {};
let currentBrand = "";
let AllProducts = [];
let isRecent = false;
let isReasonable = false;
let onlyFavorite = false;

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const filterRecent = document.querySelector('#filter-recent');
const filterReasonable = document.querySelector('#filter-reasonable');
const sorting = document.querySelector('#sort');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbNewProducts = document.querySelector('#nbNewProducts');
const spanP50 = document.querySelector('#p50');
const spanP90 = document.querySelector('#p90');
const spanP95 = document.querySelector('#p95');
const spanLast_released = document.querySelector('#last-released');
const showFavorite = document.querySelector('#show-favorite');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchAllProducts = async (page = 1, size = currentPagination.count) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();
    if (body.success !== true) {
      console.error(body);
       return {currentProducts, currentPagination};
    }
    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

const fetchProducts = async (page = 1, size = 12) => {
  try {
    let daten = new Date("2022-09-24");
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();
    if (body.success !== true) {
      console.error(body);
       return {currentProducts, currentPagination};
    }
    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

const fetchProductsByBrand = async (page = 1, size = 12, currentBrand = '') => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}&brand=${currentBrand}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }
    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

const fetchBrand = async () => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app/brands`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return [];
    }
    return body.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const pValue = percent =>{
  const percentage = percent/100;
  if(currentProducts != undefined && currentProducts.length > 0){
    const index = Math.ceil(currentProducts.length * percentage) - 1;
    const products = sort_price_low_high(currentProducts);
    return products[index].price;
  }
  else{
    return 0;
  }
  
}

const last_released = () =>{
  if(currentProducts != undefined && currentProducts.length != 0){
    const products = sort_date_new_old(currentProducts);
    return new Date(products[0].released).toISOString().split('T')[0];
  }
  else{
    return "2000-01-01";
  }
}

const getFavortite = () =>{
  const favoriteProductsJSON = localStorage.getItem('favoriteProducts');
  const newfavoriteProducts = JSON.parse(favoriteProductsJSON);
  return newfavoriteProducts;
};

function saveFavorite(uuid_product){
  favoriteProducts = getFavortite();
  if(favoriteProducts == undefined){
    favoriteProducts = [];
  }
  let exists = false;
  favoriteProducts.forEach(item=>{
    if(item.uuid == uuid_product){
      exists = true;
    }
  })
  if(exists == false){
    let searched_prod;
    AllProducts.forEach(item=>{
      if(item.uuid==uuid_product){
        favoriteProducts.push(searched_prod = item);
      }
    });
    const favoriteProductsJSON = JSON.stringify(favoriteProducts);
    localStorage.setItem('favoriteProducts', favoriteProductsJSON);
  }
}

function deleteFavorite(uuid_product){
  favoriteProducts = getFavortite();
  if(favoriteProducts == undefined){
    favoriteProducts = [];
  }
  else{
    favoriteProducts.forEach((item, index)=>{
      if(item.uuid == uuid_product){
        favoriteProducts.splice(index, index);
      }
    });
    const favoriteProductsJSON = JSON.stringify(favoriteProducts);
    localStorage.setItem('favoriteProducts', favoriteProductsJSON);
  }
}

//#region Render


/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  let template ="";
  let page = currentPagination.currentPage;
  let size = currentPagination.pageSize
  let newarray = [];
  products = AllProducts;
  if(products!=undefined){
    if(onlyFavorite == true && favoriteProducts != undefined && favoriteProducts.length > 0){
      products = getFavortite();
    }
    else if(onlyFavorite == true && (favoriteProducts == undefined || favoriteProducts.length == 0)){
      alert("Empty favortite list.")
    }
    if(currentBrand!=""){
      const temporary = []
      products.forEach(item =>{
        if(item.brand == currentBrand){
          temporary.push(item);
        }
      });
      products=temporary
    }
    if(isRecent == true){
      const temporary = [];
      products.forEach(item =>{
        let diffTime = Math.abs(new Date() - new Date(item.released));
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if(diffDays<=14){
          temporary.push(item);
        }
      });
      products=temporary;
    }
    if(isReasonable == true){
      const temporary = [];
      products.forEach(item =>{
        if(item.price<=50){
          temporary.push(item);
        }
      });
      products=temporary;
    }
    currentProducts = products;
    for(let i=0; i<size; i++){
      if((page-1)*size+i<currentPagination.count){
        newarray.push(products[(page-1)*size+i]);
        
      }
    }
    template = newarray
    .map(product => {
      if(product != undefined){
        return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
        <button class="favorite" onclick="saveFavorite('${product.uuid}')">Favorite</button>
        <button class="unfavorite" onclick="deleteFavorite('${product.uuid}')">Unfavorite</button>
      </div>
    `;
      }
    })
    .join('');
  }
  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const currentPage = currentPagination.currentPage;
  const pageCount = Math.floor(currentProducts.length/currentPagination.pageSize)+1;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  if(currentPage>pageCount){
    selectPage.selectedIndex = 0;
    currentPagination.currentPage = 1;
  }
  else{
    selectPage.selectedIndex = currentPage - 1;
  }
};

/**
 * Render brand selector
 * @param  {Array} brands
 */
const renderBrand = brands => {
  const brandsArray = brands.result;
  let options = Array.from(
    brandsArray, value => `<option value="${value}">${value}</option>`
  ).join('');
  options = `<option value=""></option>` + options;
  selectBrand.innerHTML = options;
};


/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const count = pagination.count;
  const temporary = [];
  currentProducts.forEach(item =>{
    let diffTime = Math.abs(new Date() - new Date(item.released));
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if(diffDays<=14){
      temporary.push(item);
    }
  });
  let count_recent = temporary.length;
  spanNbProducts.innerHTML = count;
  spanNbNewProducts.innerHTML = count_recent;
  spanP50.innerHTML = pValue(50);
  spanP90.innerHTML = pValue(90);
  spanP95.innerHTML = pValue(95);
  spanLast_released.innerHTML = last_released();
};

const render = (products, pagination) => {
  renderPagination(pagination);
  renderProducts(currentProducts);
  renderIndicators(pagination);
};

//#endregion


/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  currentPagination.pageSize = parseInt(event.target.value);
  render(currentProducts, currentPagination);
});

/**
 * Select the number of the page to display
 */
selectPage.addEventListener('change', async (event) => {
  currentPagination.currentPage = parseInt(event.target.value);
  render(currentProducts, currentPagination);
});

/**
 * Select the brand to display
 */
selectBrand.addEventListener('change', async (event) => {
  currentBrand = event.target.value;
  render(currentProducts, currentPagination);
});

/**
 * Filter by recently released
 */
filterRecent.addEventListener('change', async (event) => {
  if(event.target.value == "Yes"){
    isRecent = true;
  }
  else{
    isRecent=false;
    currentProducts = AllProducts;
  }
  render(currentProducts, currentPagination);
});

/**
 * Filter by reasonable price
 */
filterReasonable.addEventListener('change', async (event) => {
  if(event.target.value == "Yes"){
    isReasonable = true;
  }
  else{
    isReasonable=false;
    currentProducts = AllProducts;
  }
  render(currentProducts, currentPagination);
});

const sort_price_low_high = products =>{
  return products.sort((a,b) => a.price - b.price)
};

const sort_price_high_low = products =>{
  return products.sort((a,b) => b.price - a.price)
};

const sort_date_new_old = products =>{
  return products.sort((a,b) => new Date(b.released)- new Date(a.released))
};

const sort_date_old_new = products =>{
  return products.sort((a,b) => new Date(a.released)- new Date(b.released))
};

/**
 * Sorting the results
 */
sorting.addEventListener('change', async (event) => {
  if(event.target.value == "price-asc"){
    currentProducts = sort_price_low_high(currentProducts);
  }
  else if(event.target.value == "price-desc"){
    currentProducts = sort_price_high_low(currentProducts);
  }
  else if(event.target.value == "date-asc"){
    currentProducts = sort_date_new_old(currentProducts);
  }
  else if(event.target.value == "date-desc"){
    currentProducts = sort_date_old_new(currentProducts);
  }
  render(currentProducts, currentPagination);
});

/**
 * Show only favorite
 */
showFavorite.addEventListener('change', async (event) => {
  if(event.target.value == "Yes"){
    onlyFavorite = true;
  }
  else{
    onlyFavorite = false;
    currentProducts = AllProducts;
  }
  render(currentProducts, currentPagination);
});


document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  const brands = await fetchBrand();
  setCurrentProducts(products);
  AllProducts = (await fetchAllProducts()).result;
  currentProducts = AllProducts;
  renderBrand(brands)
  render(currentProducts, currentPagination);
  
});

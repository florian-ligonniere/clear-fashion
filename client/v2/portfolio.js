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
let currentPagination = {};
let currentBrand = "";
let AllProducts = [];
let isRecent = false;
let isReasonable = false;

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const filterRecent = document.querySelector('#filter-recent');
const filterReasonable = document.querySelector('#filter-reasonable');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

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
  if(products!=undefined){
    if(isRecent == true){
      const temporary = [];
      currentProducts.forEach(item =>{
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
      currentProducts.forEach(item =>{
        if(item.price<=50){
          temporary.push(item);
        }
      });
      products=temporary;
    }
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
  options = `<option value=" "> </option>` + options;
  selectBrand.innerHTML = options;
};


/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = currentProducts.length;

  spanNbProducts.innerHTML = count;
};

const render = (products, pagination) => {
  renderPagination(pagination);
  renderProducts(products);
  renderIndicators(pagination);
};

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

  if(event.target.value == ' '){
    currentProducts = AllProducts;
    render(currentProducts, currentPagination);
  }
  else{
    const newproducts = [];
    currentProducts.forEach(item =>{
      if(item.brand == event.target.value){
        newproducts.push(item)
      }
    });
    currentProducts = newproducts;
    render(currentProducts, currentPagination)
  }
});

/**
 * Filter by recently realesed
 */
filterRecent.addEventListener('change', async (event) => {
  if(event.target.value == "Yes"){
    isRecent = true;
  }
  else{
    isRecent=false;
  }
  render(currentProducts, currentPagination);
});

/**
 * Filter by recently realesed
 */
filterReasonable.addEventListener('change', async (event) => {
  if(event.target.value == "Yes"){
    isReasonable = true;
  }
  else{
    isReasonable=false;
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

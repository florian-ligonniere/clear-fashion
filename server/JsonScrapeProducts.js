const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/montlimartbrand');
const circleSportswearbdrand = require('./eshops/circleSportswearbdrand');
const fs = require('fs');

async function jsonProductList () {
  try {
    const productsCircle = await circleSportswearbdrand.scrape("https://shop.circlesportswear.com/collections/collection-femme");
    const productsMontlimart = await montlimartbrand.scrape("https://www.montlimart.com/72-nouveautes");
    const productsDedicated = await dedicatedbrand.scrape("https://www.dedicatedbrand.com/en/men/news/");
    let products = '[';
    productsCircle.forEach(item =>{
        products+=(JSON.stringify(item)+",\n")
    })

    productsMontlimart.forEach(item =>{
      products+=(JSON.stringify(item)+",\n")
    })

    productsDedicated.forEach(item =>{
      products+=(JSON.stringify(item)+",\n")
    })


    products =products.slice(0,-2)+'\n]';

    //const jsonData = JSON.stringify(products);

    await fs.promises.writeFile('productsBrands.json', products, err => {
      if (err) {
          console.log('Error writing file', err)
      } else {
          console.log('Successfully wrote file')
      }
    });
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

jsonProductList();
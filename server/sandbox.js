/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/montlimartbrand');
const circleSportswearbdrand = require('./eshops/circleSportswearbdrand');

async function sandbox (eshop = 'https://shop.circlesportswear.com/collections/collection-femme') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    const products = await circleSportswearbdrand.scrape(eshop);

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);

const fs = require("fs");
const path = require("path");

const core = require("../../../core");

async function getSvg(req, res, next) {
  console.log('here')
  const name = 'Avios Promo Campaign'; // TODO: temp
  try {
    const src = fs.createReadStream(path.join(__dirname, `../../../svg/${name}.svg`));
    src.pipe(res);
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  getSvg
};

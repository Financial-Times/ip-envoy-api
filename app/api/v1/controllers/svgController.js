const fs = require("fs");
const path = require("path");

const core = require("../../../core");

async function getSvg(req, res, next) {
  const name = 'Avios Promo Campaign'; // TODO: temp
  try {
    const src = fs.createReadStream(path.join(__dirname, `../../../../svg/${name}`));
    src.pipe(res);
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  getSvg
};

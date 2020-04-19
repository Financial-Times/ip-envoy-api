const core = require("../../../core");

async function list(req, res, next) {
  try {
    const silos = await core.silo.list("user");
    return res.status(200).json({
      data: silos
    });
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  list
};

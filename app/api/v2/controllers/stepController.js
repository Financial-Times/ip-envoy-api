const core = require("../../../core");

async function list(req, res, next) {
  try {
    const steps = await core.step.list("user");
    return res.status(200).json({
      data: steps
    });
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  list
};

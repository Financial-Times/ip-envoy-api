const core = require("../../../core");

async function list(req, res, next) {
  try {
    const actions = await core.action.list({ entityType: "user" });
    return res.status(200).json({
      data: actions
    });
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  list
};

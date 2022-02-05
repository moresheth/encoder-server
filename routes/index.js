const express                           = require("express");
const router                            = express.Router();

const poster_controller                 = require("../controllers/poster_controller");

router.get(     '/poster',              poster_controller.generate );

module.exports = router;

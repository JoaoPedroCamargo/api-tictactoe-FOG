"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
router.get('/', (req, res) => {
    res.send({ response: 'Server is up and running' }).status(200);
});
exports.default = router;
//# sourceMappingURL=router.js.map
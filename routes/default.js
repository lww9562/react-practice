const router = require("express").Router();

router.route("/test").get((req, res) => {
    console.log('testing');
})
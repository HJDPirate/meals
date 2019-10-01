const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
// New user sign-up
router.post("/signup", async (req, res) => {
  const user = new user(req.body);
});

// User log-in
router.post("/login", (req, res) => {});

// User log-out
router.get("/logout", auth, (req, res) => {});

// User edit profile
router.patch("/profile", auth, async (req, res) => {});

// User delete
router.delete("/delete", auth, async (req, res) => {});

module.exports = router;

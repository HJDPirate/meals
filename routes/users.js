const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/user");

// New user sign-up
router.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.newAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// User log-in
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    console.log("user is", user);
    if (!user) {
      return res.status(400).send("account not found");
    }
    const token = await user.newAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

// User log-out
router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send("logged out");
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("logged out all");
  } catch (e) {
    res.status(500).send();
  }
});

// User view profile
router.get("/profile", auth, (req, res) => {
  res.send(req.user);
});

// User edit profile
router.patch("/profile", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  console.log("UPDATES:", updates);
  const allowedUpdates = ["email", "password"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// User delete profile
router.delete("/profile", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;

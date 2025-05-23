const express = require("express");
const bodyParser = require("body-parser");
const { User, Exercise } = require("./models/models")

const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  const newUser = new User({
    username: req.body.username,
  })
  newUser.save((err, data) => {
    if (err) return res.status(500).json({ err: "Database error" })
    res.json({
      username: data.username,
    })
  })
});

app.post("/api/users/:_id/exercises", (req, res) => {
  const userId = req.params._id;
  const { description, duration, date } = req.body;

  User.findById(userId, (err, user) => {
    if (err) return res.status(500).json({ error: "DB Error" });
    if (!user) return res.status(404).json({ error: "User not found" });

    console.log(user)
    const newExercise = new Exercise({
      userId: user._id,
      username: user.username,
      description,
      duration: parseInt(duration),
      date: date ? new Date(date) : new Date()
    });

    newExercise.save((err, data) => {
      if (err) return res.status(500).json({ error: "Database Error" });

      res.json({
        _id: user._id,
        username: user.username,
        description: data.description,
        duration: data.duration,
        date: data.date.toDateString()
      });
    });
  });
});

app.get("/api/users/:_id/exercises", (req, res) => {
  const userId = req.params._id

  User.findById(userId, (err, user) => {
    if (err) return res.status(500).json({ error: "DB Error" });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user)
  })
})

app.get("/api/exercises", async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
});


app.get("/api/users/:_id/logs", async (req, res) => {
  const _id = req.params._id

  try {
    const user = await User.findById(_id)
    if (!user) res.status(404).json({ error: "User not found" })
    const exercises = await Exercise.find({ userId: _id });
    res.json({
      _id: user._id,
      username: user.username,
      count: exercises.length,
      log: exercises.map(ex => ({
        description: ex.description,
        duration: ex.duration,
        date: ex.date.toDateString()
      }))
    })
  } catch {
    res.status(500).json({ error: "Server error" });

  }
})

app.get("/api/users", (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to fetch users" });
    });
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

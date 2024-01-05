const express = require("express");
const db = require("./dbFunctions");
const pairRouter = express.Router();

pairRouter.get("/", async (req, res) => {
  try {
    const wordPairs = await db.getAll();
    res.json(wordPairs);
  } catch (err) {
    console.log(err);
    res.status(404).json(err).end();
  }
});

pairRouter.post("/", async (req, res) => {
  try {
    const newPair = await db.save(req.body);
    res.status(201).json(newPair);
  } catch (err) {
    console.log(err);
    res.status(400).json(err).end();
  }
});

pairRouter.delete("/:myId([0-9]+)", async (req, res) => {
  const id = parseInt(req.params.myId);
  try {
    await db.delete(id);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(404).json(err).end();
  }
});

pairRouter.put("/:myId([0-9]+)", async (req, res) => {
  const id = parseInt(req.params.myId);
  const updatedPair = req.body;
  try {
    await db.update(id, updatedPair);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(404).json(err).end();
  }
});

module.exports = pairRouter;

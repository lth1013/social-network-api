const { User, Thought } = require("../models");

const thoughtController = {
  // GET all thoughts

  getAllThoughts(req, res) {
    Thought.find({})
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
      });
  },

  // GET a single thought by its _id

  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .then((dbThoughtData) => {
        // If no thought is found, send 404
        if (!dbThoughtData) {
          res
            .status(404)
            .json({ message: "Sorry! No thought found with this id" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
      });
  },

  // POST a new thought, push the created thought's _id to the associated user's thoughts array field

  createThought({ body }, res) {
    Thought.create(body)

      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res
            .status(404)
            .json({ message: "Sorry! No user found with this id" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((error) => res.json(error));
  },
  // PUT to update a thought by its _id

  updateThought({ params, body }, res) {
    Thought.findOneandUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res
            .status(404)
            .json({ message: "Sorry! No thought found with this id" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((error) => res.status(500).json(error));
  },

  // DELETE to remove a thought by its _id

  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res
            .status(404)
            .json({ message: "Sorry! No thought found with this id" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((error) => res.status(500).json(error));
  },

  // POST to create a reaction stored in a single thought's reactions array field

  createReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res
            .status(404)
            .json({ message: "Sorry! No thought found with this id" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((error) => res.json(error));
  },

  // DELETE to pull and remove a reaction by the reaction's reactionId value

  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((error) => res.json(error));
  },
};

module.exports = thoughtController;
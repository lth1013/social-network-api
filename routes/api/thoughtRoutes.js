const router = require('express').Router();

const {
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction,
    } = require('../../controllers/thought-controller');

// get all thoughts

router
    .route('/')
    .get(getAllThoughts)
    .post(createThought);

// get one thought by id

router
    .route('/:id')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought);

// add reaction

router
    .route('/:thoughtId/reactions')
    .post(addReaction);

// remove reaction

router
    .route('/:thoughtId/reactions/:reactionId')
    .delete(removeReaction);

module.exports = router;
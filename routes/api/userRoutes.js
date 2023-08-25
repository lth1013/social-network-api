const router = require('express').Router();

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend,
    } = require('../../controllers/user-controller');

// get all users
router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

// get one user by id

router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

// add friend

router
    .route('/:userId/friends/:friendId')
    .post(addFriend)
    .delete(removeFriend);

module.exports = router;


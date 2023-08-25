const { User, Thought } = require('../models'); 

const userController = {

    // GET all users 

    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
    },
    // GET a single user by its _id and populated thought and friend data

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => {
            // If no user is found, send 404
            if (!dbUserData) {
                res.status(404).json({ message: 'Sorry! No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
    },

    // POST a new user

    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(error => res.status(500).json(error));
    },

    // PUT to update a user by its _id

    updateUser({ params, body }, res) {
        User.findOneandUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'Sorry! No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(error => res.status(500).json(error));
    },

    // DELETE to remove user by its _id

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'Sorry! No user found with this id' });
                return;
            }
            // remove the user's thoughts from the database
            Thought.deleteMany({ username: dbUserData.username })
            .then(() => {
                res.json({ message: 'User and associated thoughts deleted' });
            })
            .catch(error => res.status(500).json(error));
        })
        .catch(error => res.status(500).json(error));
    },

    // POST to add a new friend to a user's friend list

    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'Sorry! No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(error => res.status(500).json(error));
    },

    // DELETE to remove a friend from a user's friend list

    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'Sorry! No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(error => res.status(500).json(error));
    }
};

module.exports = userController;




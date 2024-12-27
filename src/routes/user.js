const express = require('express');

const userRoutes = express.Router();

const connectionRequests = require('../models/connectionRequest');

const userAuth = require('../middleware/auth');

userRoutes.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requests = await connectionRequests
      .find({
        toUserId: loggedInUser._id,
        status: 'interested',
      })
      .populate('fromUserId', [
        'firstName',
        'lastName',
        'age',
        'gender',
        'about',
      ]);

    res.json({ message: 'data fetch successfully', data: requests });
  } catch (error) {
    res.send('error' + error);
  }
});

userRoutes.get('/user/connections', userAuth, async (req, res) => {
  try {
    const safeData = 'firstName lastName skills photoURL about';
    const loggedInUser = req.user;

    const connections = await connectionRequests
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: 'accepted' },

          {
            fromUserId: loggedInUser,
            status: 'accepted',
          },
        ],
      })
      .populate('toUserId', safeData)
      .populate('fromUserId', safeData);

    const filteredConnectionsFromUserId = connections.map(
      (connection) => connection.fromUserId
    );
    const filteredConnectionsToUserId = connections.map(
      (connection) => connection.toUserId
    );

    const totalConnections = filteredConnectionsFromUserId.concat(
      filteredConnectionsToUserId
    );

    const filteredConnections = totalConnections.filter(
      (connection) => connection._id.toString() != loggedInUser._id.toString()
    );

    res.json(filteredConnections);
  } catch (error) {
    res.send(error);
  }
}),
  (module.exports = userRoutes);

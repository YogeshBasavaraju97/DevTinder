const express = require('express');

const userRoutes = express.Router();

const connectionRequests = require('../models/connectionRequest');

const userAuth = require('../middleware/auth');
const User = require('../models/user');
const cors = express.cors;

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
  userRoutes.get('/feed', userAuth, async (req, res) => {

    try {
      const loggedInUser = req.user;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      limit = limit > 50 ? 50 : limit;

      const skip = (page - 1) * 10;

      const hideConnections = await connectionRequests
        .find({
          $or: [
            { toUserId: loggedInUser._id },
            { fromUserId: loggedInUser._id },
          ],
        })
        .select('fromUserId toUserId');

      const hideUsersFromFeed = new Set();
      hideConnections
        .forEach((req) => {
          hideUsersFromFeed.add(req.fromUserId.toString());
          hideUsersFromFeed.add(req.toUserId.toString());
        })
        .select(safeData)
        .skip(skip)
        .limit(limit);
      console.log(hideUsersFromFeed);
      const user = await User.find({
        $and: [
          { _id: { $nin: Array.from(hideUsersFromFeed) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      });

      res.json({ data: user });
    } catch (error) {
      res.send(error);
    }

  });

module.exports = userRoutes;

const express = require('express');
const userAuth = require('../middleware/auth');
const user = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');

const requestRoutes = express.Router();

requestRoutes.post(
  '/request/send/:status/:toUserId',
  userAuth,
  async (req, res) => {
    try {
      let fromUserId = req.user._id;
      let toUserId = req.params.toUserId;
      let status = req.params.status;

      const ALLOWED_STATUS = ['interested', 'ignored'];
      if (!ALLOWED_STATUS.includes(status)) {
        return res.json({ message: 'invalid status typ', data: { status } });
      }

      let existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { formUserId: toUserId, toUserId: fromUserId },
        ],
      });

      const toUser = await user.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: 'user not found' });
      }

      if (existingConnectionRequest) {
        return res.status(400).json({ message: 'connection already exists' });
      }

      let connectionRequest = new ConnectionRequest({
        toUserId,
        fromUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({ message: 'request send', data: data });
    } catch (error) {
      res.send('error ' + error);
    }
  }
);

requestRoutes.post(
  '/request/review/:status/:requestId',
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      const { status, requestId } = req.params;
      //validate the status

      const allowedStatus = ['accepted', 'rejected'];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: 'status is invalid' });
      }

      const connectionRequestExist = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: 'interested',
      });

      if (!connectionRequestExist) {
        return res.status(400).json({ message: 'Invalid request' });
      }

      connectionRequestExist.status = status;

      const data = await connectionRequestExist.save();

      res.json({
        message: `${loggedInUser.firstName} has ${status} the request`,
        data: data,
      });
    } catch (error) {
      res.status(400).send('error ' + error);
    }
  }
);
module.exports = requestRoutes;

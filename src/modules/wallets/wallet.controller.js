'use strict';

const walletService = require('./wallet.service');
const ApiResponse = require('../../utils/ApiResponse');
const { StatusCodes } = require('http-status-codes');

const getMyWallet = async (req, res) => {
  const data = await walletService.getMyWallet(req.user.id, req.query);
  res.json(new ApiResponse(StatusCodes.OK, data, 'Wallet fetched successfully'));
};

module.exports = {
  getMyWallet,
};

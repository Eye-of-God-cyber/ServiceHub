'use strict';

const reviewService = require('./review.service');
const ApiResponse = require('../../utils/ApiResponse');
const { StatusCodes } = require('http-status-codes');

const getReviews = async (req, res) => {
  const result = await reviewService.getReviews(req.query);
  const response = new ApiResponse(StatusCodes.OK, result.data, 'Reviews fetched successfully');
  response.meta = result.meta;
  res.json(response);
};

const createReview = async (req, res) => {
  const data = await reviewService.createReview(req.user.id, req.body);
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, data, 'Review created successfully'));
};

const createReviewReply = async (req, res) => {
  const data = await reviewService.createReviewReply(req.user.id, req.params.reviewId, req.body);
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, data, 'Reply posted successfully'));
};

module.exports = {
  getReviews,
  createReview,
  createReviewReply,
};

'use strict';

/**
 * Parses page and limit from query parameters and returns Prisma-compatible skip and take.
 */
const getPaginationOptions = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 20)); // cap at 100
  const skip = (page - 1) * limit;

  return { page, limit, skip, take: limit };
};

/**
 * Formats a paginated response.
 */
const formatPaginatedResponse = (data, total, page, limit) => {
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  };
};

module.exports = {
  getPaginationOptions,
  formatPaginatedResponse,
};

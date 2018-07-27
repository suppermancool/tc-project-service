
/* globals Promise */
/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * This is validateTimelineRequestBody file.
 * @author TCDEVELOPER
 * @version 1.0
 */

import validateTimelineReference from './validateTimelineReference';


/**
 * The middleware to validate and get the projectId specified by the timeline request object,
 * and set to the request params. This should be called after the validate() middleware,
 * and before the permissions() middleware.
 * @param {Object} req the express request instance
 * @param {Object} res the express response instance
 * @param {Function} next the express next middleware
 */
// eslint-disable-next-line valid-jsdoc
module.exports = function def(req, res, next) {
  return validateTimelineReference(req, req.body.param, next);
};

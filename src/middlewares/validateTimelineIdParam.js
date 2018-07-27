
/* globals Promise */
/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * This is validateTimelineIdParam file.
 * @author TCDEVELOPER
 * @version 1.0
 */

import validateTimelineReference from './validateTimelineReference';

const models = require('../models').default;
/**
 * The middleware to validate and get the projectId specified by the timelineId from request
 * path parameter, and set to the request params. This should be called after the validate()
 * middleware, and before the permissions() middleware.
 * @param {Object} req the express request instance
 * @param {Object} res the express response instance
 * @param {Function} next the express next middleware
 */
// eslint-disable-next-line valid-jsdoc
module.exports = function def(req, res, next) {
  models.Timeline.findById(req.params.timelineId)
    .then((timeline) => {
      if (!timeline) {
        const apiErr = new Error(`Timeline not found for timeline id ${req.params.timelineId}`);
        apiErr.status = 404;
        return next(apiErr);
      }

      // Set timeline to the request to be used in the next middleware
      req.timeline = timeline;

      return validateTimelineReference(req, timeline, next);
    });
};

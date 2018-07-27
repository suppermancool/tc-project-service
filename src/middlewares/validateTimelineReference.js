
/* globals Promise */
/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * This is validateTimelineIdParam file.
 * @author TCDEVELOPER
 * @version 1.0
 */


import { TIMELINE_REFERENCES } from '../constants';

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
module.exports = function def(req, timeline, next) {
  // The timeline refers to a project
  if (timeline.reference === TIMELINE_REFERENCES.PROJECT) {
    // Set projectId to the params so it can be used in the permission check middleware
    req.params.projectId = timeline.referenceId;

    // Validate projectId to be existed
    if (timeline.projectId) {
      return models.Project.findOne({
        where: {
          id: req.params.projectId,
          deletedAt: { $eq: null },
        },
      })
        .then((project) => {
          if (!project) {
            const apiErr = new Error(`Project not found for project id ${req.params.projectId}`);
            apiErr.status = 422;
            return next(apiErr);
          }
          return next();
        });
    }

    return next();
  }

  // The timeline refers to a project
  if (timeline.reference === TIMELINE_REFERENCES.PRODUCT) {
    // Validate product to be existed
    return models.PhaseProduct.findOne({
      where: {
        id: timeline.referenceId,
        deletedAt: { $eq: null },
      },
    })
      .then((product) => {
        if (!product) {
          const apiErr = new Error(`Product not found for product id ${timeline.referenceId}`);
          apiErr.status = 422;
          return next(apiErr);
        }

        // Set projectId to the params so it can be used in the permission check middleware
        req.params.projectId = product.projectId;
        return next();
      });
  }

  // The timeline refers to a phase
  return models.ProjectPhase.findOne({
    where: {
      id: timeline.referenceId,
      deletedAt: { $eq: null },
    },
  })
    .then((phase) => {
      if (!phase) {
        const apiErr = new Error(`Phase not found for phase id ${timeline.referenceId}`);
        apiErr.status = 422;
        return next(apiErr);
      }

      // Set projectId to the params so it can be used in the permission check middleware
      req.params.projectId = phase.projectId;
      return next();
    });
};

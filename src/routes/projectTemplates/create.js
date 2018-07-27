/**
 * API to add a project template
 */
import validate from 'express-validation';
import _ from 'lodash';
import Joi from 'joi';
import { middleware as tcMiddleware } from 'tc-core-library-js';
import util from '../../util';
import models from '../../models';

const permissions = tcMiddleware.permissions;

const schema = {
  body: {
    param: Joi.object().keys({
      id: Joi.any().strip(),
      name: Joi.string().max(255).required(),
      key: Joi.string().max(45).required(),
      category: Joi.string().max(45).required(),
      icon: Joi.string().max(255).required(),
      question: Joi.string().max(255).required(),
      info: Joi.string().max(255).required(),
      aliases: Joi.array().required(),
      scope: Joi.object().required(),
      phases: Joi.object().required(),
      disabled: Joi.boolean().optional(),
      hidden: Joi.boolean().optional(),
      createdAt: Joi.any().strip(),
      updatedAt: Joi.any().strip(),
      deletedAt: Joi.any().strip(),
      createdBy: Joi.any().strip(),
      updatedBy: Joi.any().strip(),
      deletedBy: Joi.any().strip(),
    }).required(),
  },
};

/**
 * Validates the project type being one from the allowed ones.
 *
 * @param {String} type key of the project type to be used
 * @returns {Promise} promise which resolves to a project type if it is valid, rejects otherwise with 422 error
 */
function validateProjectType(type) {
  return models.ProjectType.findOne({ where: { key: type } })
  .then((projectType) => {
    if (!projectType) {
      // Not found
      const apiErr = new Error(`Project template category not found for key ${type}`);
      apiErr.status = 422;
      return Promise.reject(apiErr);
    }

    return Promise.resolve(projectType);
  });
}

module.exports = [
  validate(schema),
  permissions('projectTemplate.create'),
  (req, res, next) => {
    const projectTemplate = req.body.param;

    models.sequelize.transaction(() => {
      req.log.debug('Create Project Template - Starting transaction');
      // Validate the project template category
      return validateProjectType(projectTemplate.category)
      // Create the project template
      .then((projectTemplateCategory) => {
        req.log.debug(`Project template category ${projectTemplateCategory.key} validated successfully`);

        const entity = _.assign(projectTemplate, {
          createdBy: req.authUser.userId,
          updatedBy: req.authUser.userId,
        });
        return models.ProjectTemplate.create(entity)
          .then((createdEntity) => {
            // Omit deletedAt, deletedBy
            res.status(201).json(util.wrapResponse(
              req.id, _.omit(createdEntity.toJSON(), 'deletedAt', 'deletedBy'), 1, 201));
          })
          .catch(next);
      })
      .catch(next);
    });
  },
];

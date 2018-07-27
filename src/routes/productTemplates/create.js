/**
 * API to add a product template
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
      productKey: Joi.string().max(45).required(),
      icon: Joi.string().max(255).required(),
      brief: Joi.string().max(45).required(),
      details: Joi.string().max(255).required(),
      category: Joi.string().max(45).required(),
      aliases: Joi.array().required(),
      template: Joi.object().required(),
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
 * Validates the product category being one from the allowed ones.
 *
 * @param {String} category of the product to be used
 * @returns {Promise} promise which resolves to a product category if it is valid, rejects otherwise with 422 error
 */
function validateProductCategory(category) {
  return models.ProductCategory.findOne({ where: { key: category } })
  .then((productCategory) => {
    if (!productCategory) {
      // Not found
      const apiErr = new Error(`Product category not found for key ${category}`);
      apiErr.status = 422;
      return Promise.reject(apiErr);
    }

    return Promise.resolve(productCategory);
  });
}

module.exports = [
  validate(schema),
  permissions('productTemplate.create'),
  (req, res, next) => {
    const product = req.body.param;

    models.sequelize.transaction(() => {
      req.log.debug('Create Product - Starting transaction');
      // Validate the product category
      return validateProductCategory(product.category)
      // Create the product
      .then((productCategory) => {
        req.log.debug(`Product category ${productCategory.key} validated successfully`);

        const entity = _.assign(product, {
          createdBy: req.authUser.userId,
          updatedBy: req.authUser.userId,
        });
        return models.ProductTemplate.create(entity)
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

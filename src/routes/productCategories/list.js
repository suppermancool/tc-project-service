/**
 * API to list all project types
 */
import { middleware as tcMiddleware } from 'tc-core-library-js';
import util from '../../util';
import models from '../../models';

const permissions = tcMiddleware.permissions;

module.exports = [
  permissions('productCategories.view'),
  (req, res, next) => models.ProductCategory.findAll({
    attributes: { exclude: ['deletedAt', 'deletedBy'] },
    raw: true,
  })
    .then((productCategory) => {
      res.json(util.wrapResponse(req.id, productCategory));
    })
    .catch(next),
];

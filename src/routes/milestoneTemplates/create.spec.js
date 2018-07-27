/**
 * Tests for create.js
 */
import chai from 'chai';
import request from 'supertest';
import _ from 'lodash';
import server from '../../app';
import testUtil from '../../tests/util';
import models from '../../models';

const should = chai.should();

const productCategory = [
  {
    key: 'category1',
    displayName: 'displayName 1',
    icon: 'http://example.com/icon1.ico',
    question: 'question 1',
    info: 'info 1',
    aliases: ['key-1', 'key_1'],
    disabled: false,
    hidden: false,
    createdBy: 1,
    updatedBy: 1,
  },
];

const productTemplates = [
  {
    name: 'name 1',
    productKey: 'productKey 1',
    icon: 'http://example.com/icon1.ico',
    brief: 'brief 1',
    details: 'details 1',
    category: 'category1',
    aliases: {
      alias1: {
        subAlias1A: 1,
        subAlias1B: 2,
      },
      alias2: [1, 2, 3],
    },
    template: {
      template1: {
        name: 'template 1',
        details: {
          anyDetails: 'any details 1',
        },
        others: ['others 11', 'others 12'],
      },
      template2: {
        name: 'template 2',
        details: {
          anyDetails: 'any details 2',
        },
        others: ['others 21', 'others 22'],
      },
    },
    createdBy: 1,
    updatedBy: 2,
  },
  {
    name: 'template 2',
    productKey: 'productKey 2',
    category: 'category1',
    icon: 'http://example.com/icon2.ico',
    brief: 'brief 2',
    details: 'details 2',
    aliases: {},
    template: {},
    createdBy: 3,
    updatedBy: 4,
    deletedAt: new Date(),
  },
];
const milestoneTemplates = [
  {
    name: 'milestoneTemplate 1',
    duration: 3,
    type: 'type1',
    order: 1,
    productTemplateId: 1,
    plannedText: 'text to be shown in planned stage',
    blockedText: 'text to be shown in blocked stage',
    activeText: 'text to be shown in active stage',
    completedText: 'text to be shown in completed stage',
    createdBy: 1,
    updatedBy: 2,
  },
  {
    name: 'milestoneTemplate 2',
    duration: 4,
    type: 'type2',
    order: 2,
    plannedText: 'text to be shown in planned stage - 2',
    blockedText: 'text to be shown in blocked stage - 2',
    activeText: 'text to be shown in active stage - 2',
    completedText: 'text to be shown in completed stage - 2',
    productTemplateId: 1,
    createdBy: 2,
    updatedBy: 3,
  },
];

describe('CREATE milestone template', () => {
  beforeEach(() => testUtil.clearDb()
    .then(() => models.ProductCategory.bulkCreate(productCategory))
    .then(() => models.ProductTemplate.bulkCreate(productTemplates))
    .then(() => models.ProductMilestoneTemplate.bulkCreate(milestoneTemplates)),
  );
  after(testUtil.clearDb);

  describe('POST /productTemplates/{productTemplateId}/milestones', () => {
    const body = {
      param: {
        name: 'milestoneTemplate 3',
        description: 'description 3',
        duration: 33,
        type: 'type3',
        order: 1,
        plannedText: 'text to be shown in planned stage - 3',
        blockedText: 'text to be shown in blocked stage - 3',
        activeText: 'text to be shown in active stage - 3',
        completedText: 'text to be shown in completed stage - 3',
        hidden: true,
      },
    };

    it('should return 403 if user is not authenticated', (done) => {
      request(server)
        .post('/v4/productTemplates/1/milestones')
        .send(body)
        .expect(403, done);
    });

    it('should return 403 for member', (done) => {
      request(server)
        .post('/v4/productTemplates/1/milestones')
        .set({
          Authorization: `Bearer ${testUtil.jwts.member}`,
        })
        .send(body)
        .expect(403, done);
    });

    it('should return 403 for copilot', (done) => {
      request(server)
        .post('/v4/productTemplates/1/milestones')
        .set({
          Authorization: `Bearer ${testUtil.jwts.copilot}`,
        })
        .send(body)
        .expect(403, done);
    });

    it('should return 403 for manager', (done) => {
      request(server)
        .post('/v4/productTemplates/1/milestones')
        .set({
          Authorization: `Bearer ${testUtil.jwts.manager}`,
        })
        .send(body)
        .expect(403, done);
    });

    it('should return 404 for non-existed product template', (done) => {
      request(server)
        .post('/v4/productTemplates/1000/milestones')
        .set({
          Authorization: `Bearer ${testUtil.jwts.admin}`,
        })
        .send(body)
        .expect(404, done);
    });

    it('should return 422 if missing name', (done) => {
      const invalidBody = {
        param: {
          name: undefined,
        },
      };

      request(server)
        .post('/v4/productTemplates/1/milestones')
        .set({
          Authorization: `Bearer ${testUtil.jwts.admin}`,
        })
        .send(invalidBody)
        .expect('Content-Type', /json/)
        .expect(422, done);
    });

    it('should return 422 if missing duration', (done) => {
      const invalidBody = {
        param: {
          duration: undefined,
        },
      };

      request(server)
        .post('/v4/productTemplates/1/milestones')
        .set({
          Authorization: `Bearer ${testUtil.jwts.admin}`,
        })
        .send(invalidBody)
        .expect('Content-Type', /json/)
        .expect(422, done);
    });

    it('should return 422 if missing type', (done) => {
      const invalidBody = {
        param: {
          type: undefined,
        },
      };

      request(server)
        .post('/v4/productTemplates/1/milestones')
        .set({
          Authorization: `Bearer ${testUtil.jwts.admin}`,
        })
        .send(invalidBody)
        .expect('Content-Type', /json/)
        .expect(422, done);
    });

    it('should return 422 if missing order', (done) => {
      const invalidBody = {
        param: {
          order: undefined,
        },
      };

      request(server)
        .post('/v4/productTemplates/1/milestones')
        .set({
          Authorization: `Bearer ${testUtil.jwts.admin}`,
        })
        .send(invalidBody)
        .expect('Content-Type', /json/)
        .expect(422, done);
    });

    it('should return 201 for admin', (done) => {
      request(server)
        .post('/v4/productTemplates/1/milestones')
        .set({
          Authorization: `Bearer ${testUtil.jwts.admin}`,
        })
        .send(body)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          const resJson = res.body.result.content;
          should.exist(resJson.id);
          resJson.name.should.be.eql(body.param.name);
          resJson.description.should.be.eql(body.param.description);
          resJson.duration.should.be.eql(body.param.duration);
          resJson.type.should.be.eql(body.param.type);
          resJson.order.should.be.eql(body.param.order);
          resJson.plannedText.should.be.eql(body.param.plannedText);
          resJson.blockedText.should.be.eql(body.param.blockedText);
          resJson.activeText.should.be.eql(body.param.activeText);
          resJson.completedText.should.be.eql(body.param.completedText);

          resJson.createdBy.should.be.eql(40051333); // admin
          should.exist(resJson.createdAt);
          resJson.updatedBy.should.be.eql(40051333); // admin
          should.exist(resJson.updatedAt);
          should.not.exist(resJson.deletedBy);
          should.not.exist(resJson.deletedAt);

          // Verify 'order' of the other milestones
          models.ProductMilestoneTemplate.findAll({
            where: {
              productTemplateId: 1,
            },
          }).then((milestones) => {
            _.each(milestones, (milestone) => {
              if (milestone.id === 1) {
                milestone.order.should.be.eql(1 + 1);
              } else if (milestone.id === 2) {
                milestone.order.should.be.eql(2 + 1);
              }
            });
            done();
          }).catch(() => {
            done();
          });
        });
    });

    it('should return 201 for admin without optional fields', (done) => {
      const minimalBody = _.cloneDeep(body);
      delete minimalBody.param.hidden;
      request(server)
        .post('/v4/productTemplates/1/milestones')
        .set({
          Authorization: `Bearer ${testUtil.jwts.admin}`,
        })
        .send(minimalBody)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          const resJson = res.body.result.content;
          resJson.hidden.should.be.eql(false); // default of hidden field
          done();
        });
    });

    it('should return 201 for connect admin', (done) => {
      request(server)
        .post('/v4/productTemplates/1/milestones')
        .set({
          Authorization: `Bearer ${testUtil.jwts.connectAdmin}`,
        })
        .send(body)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          const resJson = res.body.result.content;
          resJson.createdBy.should.be.eql(40051336); // connect admin
          resJson.updatedBy.should.be.eql(40051336); // connect admin
          done();
        });
    });
  });
});

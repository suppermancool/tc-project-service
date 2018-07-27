/**
 * Tests for list.js
 */
import chai from 'chai';
import request from 'supertest';

import models from '../../models';
import server from '../../app';
import testUtil from '../../tests/util';

const should = chai.should();

describe('LIST product category', () => {
  const categories = [
    {
      key: 'key1',
      displayName: 'displayName 1',
      icon: 'http://example.com/icon1.ico',
      question: 'question 1',
      info: 'info 1',
      aliases: ['key-1', 'key_1'],
      disabled: true,
      hidden: true,
      createdBy: 1,
      updatedBy: 1,
    },
    {
      key: 'key2',
      displayName: 'displayName 2',
      icon: 'http://example.com/icon2.ico',
      question: 'question 2',
      info: 'info 2',
      aliases: ['key-2', 'key_2'],
      disabled: true,
      hidden: true,
      createdBy: 1,
      updatedBy: 1,
    },
  ];

  beforeEach(() => testUtil.clearDb()
    .then(() => models.ProductCategory.create(categories[0]))
    .then(() => models.ProductCategory.create(categories[1]))
    .then(() => Promise.resolve()),
  );
  after(testUtil.clearDb);

  describe('GET /productCategories', () => {
    it('should return 200 for admin', (done) => {
      request(server)
        .get('/v4/productCategories')
        .set({
          Authorization: `Bearer ${testUtil.jwts.admin}`,
        })
        .expect(200)
        .end((err, res) => {
          const category = categories[0];

          const resJson = res.body.result.content;
          resJson.should.have.length(2);
          resJson[0].key.should.be.eql(category.key);
          resJson[0].displayName.should.be.eql(category.displayName);
          resJson[0].icon.should.be.eql(category.icon);
          resJson[0].info.should.be.eql(category.info);
          resJson[0].question.should.be.eql(category.question);
          resJson[0].aliases.should.be.eql(category.aliases);
          resJson[0].createdBy.should.be.eql(category.createdBy);
          resJson[0].disabled.should.be.eql(category.disabled);
          resJson[0].hidden.should.be.eql(category.hidden);
          should.exist(resJson[0].createdAt);
          resJson[0].updatedBy.should.be.eql(category.updatedBy);
          should.exist(resJson[0].updatedAt);
          should.not.exist(resJson[0].deletedBy);
          should.not.exist(resJson[0].deletedAt);

          done();
        });
    });

    it('should return 200 even if user is not authenticated', (done) => {
      request(server)
        .get('/v4/productCategories')
        .expect(200, done);
    });

    it('should return 200 for connect admin', (done) => {
      request(server)
        .get('/v4/productCategories')
        .set({
          Authorization: `Bearer ${testUtil.jwts.connectAdmin}`,
        })
        .expect(200)
        .end(done);
    });

    it('should return 200 for connect manager', (done) => {
      request(server)
        .get('/v4/productCategories')
        .set({
          Authorization: `Bearer ${testUtil.jwts.manager}`,
        })
        .expect(200)
        .end(done);
    });

    it('should return 200 for member', (done) => {
      request(server)
        .get('/v4/productCategories')
        .set({
          Authorization: `Bearer ${testUtil.jwts.member}`,
        })
        .expect(200, done);
    });

    it('should return 200 for copilot', (done) => {
      request(server)
        .get('/v4/productCategories')
        .set({
          Authorization: `Bearer ${testUtil.jwts.copilot}`,
        })
        .expect(200, done);
    });
  });
});

/**
 * Tests for get.js
 */
import chai from 'chai';
import request from 'supertest';

import models from '../../models';
import server from '../../app';
import testUtil from '../../tests/util';

const should = chai.should();

describe('GET product category', () => {
  const category = {
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
  };

  const key = category.key;

  beforeEach(() => testUtil.clearDb()
    .then(() => models.ProductCategory.create(category))
    .then(() => Promise.resolve()),
  );
  after(testUtil.clearDb);

  describe('GET /productCategories/{key}', () => {
    it('should return 404 for non-existed category', (done) => {
      request(server)
        .get('/v4/productCategories/1234')
        .set({
          Authorization: `Bearer ${testUtil.jwts.admin}`,
        })
        .expect(404, done);
    });

    it('should return 404 for deleted category', (done) => {
      models.ProductCategory.destroy({ where: { key } })
        .then(() => {
          request(server)
            .get(`/v4/productCategories/${key}`)
            .set({
              Authorization: `Bearer ${testUtil.jwts.admin}`,
            })
            .expect(404, done);
        });
    });

    it('should return 200 for admin', (done) => {
      request(server)
        .get(`/v4/productCategories/${key}`)
        .set({
          Authorization: `Bearer ${testUtil.jwts.admin}`,
        })
        .expect(200)
        .end((err, res) => {
          const resJson = res.body.result.content;
          resJson.key.should.be.eql(category.key);
          resJson.displayName.should.be.eql(category.displayName);
          resJson.icon.should.be.eql(category.icon);
          resJson.info.should.be.eql(category.info);
          resJson.question.should.be.eql(category.question);
          resJson.aliases.should.be.eql(category.aliases);
          resJson.disabled.should.be.eql(category.disabled);
          resJson.hidden.should.be.eql(category.hidden);
          resJson.createdBy.should.be.eql(category.createdBy);
          should.exist(resJson.createdAt);
          resJson.updatedBy.should.be.eql(category.updatedBy);
          should.exist(resJson.updatedAt);
          should.not.exist(resJson.deletedBy);
          should.not.exist(resJson.deletedAt);

          done();
        });
    });

    it('should return 200 even if user is not authenticated', (done) => {
      request(server)
        .get(`/v4/productCategories/${key}`)
        .expect(200, done);
    });

    it('should return 200 for connect admin', (done) => {
      request(server)
        .get(`/v4/productCategories/${key}`)
        .set({
          Authorization: `Bearer ${testUtil.jwts.connectAdmin}`,
        })
        .expect(200)
        .end(done);
    });

    it('should return 200 for connect manager', (done) => {
      request(server)
        .get(`/v4/productCategories/${key}`)
        .set({
          Authorization: `Bearer ${testUtil.jwts.manager}`,
        })
        .expect(200)
        .end(done);
    });

    it('should return 200 for member', (done) => {
      request(server)
        .get(`/v4/productCategories/${key}`)
        .set({
          Authorization: `Bearer ${testUtil.jwts.member}`,
        })
        .expect(200, done);
    });

    it('should return 200 for copilot', (done) => {
      request(server)
        .get(`/v4/productCategories/${key}`)
        .set({
          Authorization: `Bearer ${testUtil.jwts.copilot}`,
        })
        .expect(200, done);
    });
  });
});

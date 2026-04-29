/// <reference types="cypress" />

import { API } from './utils/api.constants';
import {
  buildApiUrl,
  validateCreatedUserStructure,
  validateErrorResponse,
  validateISODateFormat,
  validateAuthTokenResponse
} from './utils/api-test.helpers';

describe('API Testing with Reqres.in', () => {

  const headers = {
    'x-api-key': API.API_KEY
  };

  it('GET - List Users', () => {
    const url = buildApiUrl(API.ENDPOINTS.USERS);

    cy.request({ method: 'GET', url, headers }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.be.an('array');
    });
  });

  it('GET - Single User', () => {
    const url = buildApiUrl(API.ENDPOINTS.USERS, 2);

    cy.request({ method: 'GET', url, headers }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data.id).to.eq(2);
    });
  });

  it('POST - Create User', () => {
    const url = buildApiUrl(API.ENDPOINTS.USERS);

    cy.request({
      method: 'POST',
      url,
      headers,
      body: { name: 'John', job: 'QA Engineer' }
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(validateCreatedUserStructure(response.body)).to.be.true;
      expect(validateISODateFormat(response.body.createdAt)).to.be.true;
    });
  });

  it('POST - Login Successful', () => {
    const url = buildApiUrl(API.ENDPOINTS.LOGIN);

    cy.request({
      method: 'POST',
      url,
      headers,
      body: {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(validateAuthTokenResponse(response.body)).to.be.true;
    });
  });

  it('POST - Login Failed', () => {
    const url = buildApiUrl(API.ENDPOINTS.LOGIN);

    cy.request({
      method: 'POST',
      url,
      headers,
      body: { email: 'peter@klaven' },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(validateErrorResponse(response.body)).to.be.true;
    });
  });

});

import chai from 'chai';
import chaiHttp from 'chai-http';
//const chai = require('chai');
//const chaiHttp = require('chai-http');

const expect  = chai.expect;

chai.use(chaiHttp);

const API_URL = 'https://sdet-challenge-rho.vercel.app'; 
const AUTH_TOKEN = 'b97ae7a56a5cf225cf391f9c2d3d8833-43455d58'; 

// Create a delay function using setTimeout
const delay = (ms, callback) => setTimeout(callback, ms);

describe('Products API', () => {
  let productId;  
  
  // Reset the HTTP connection
  beforeEach(() => {
    // reset yhe authentication
    chai.request(API_URL); // Create a new HTTP request instance for each test
    console.log("HTTP connection reset before test.");
  });

  // Health Check
  describe('GET /health', () => {

    it('should return 200 OK', (done) => {
      chai.request(API_URL).get(`/health`)
        .end((err, res) => {
          delay(2000, () => { // Delay of 2 seconds
            expect(res).to.have.status(200); // Sometimes the API response code is 500 Internal Server Error. Hence the assertions fails sometimes
            done();
          });
        });
    });
  });

  // GET /api/products/
  describe('GET /api/products/', () => {

    it('should get all products', (done) => {
      chai
        .request(API_URL)
        .get(`/api/products/`)
        .set('Authorization', `Bearer ${AUTH_TOKEN}`)
        .end((err, res) => {
          delay(2000, () => { // Delay of 2 seconds
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            done();
          });
        });
    });
  });

  // POST /api/products/
  describe('POST /api/products/', () => {
    it('should create a new product', (done) => {
      chai
        .request(API_URL)
        .post(`/api/products/`)
        .set('Authorization', `Bearer ${AUTH_TOKEN}`)
        .send({ name: 'Test Laptop', price: 9.99, stock: 2, category: 'Electronics' })
        .end((err, res) => {
          delay(2000, () => { // Delay of 2 seconds
            expect(res).to.have.status(201); // POST API Implementation is wrong it should return 201 Created. Present response code is 200 OK 
            expect(res.body).to.be.an('object');
            expect(res.body.product).to.have.property('id');
            expect(res.body.product).to.have.property('name').eql('Test Laptop');
            productId = res.body.product.id; // Store the ID for later tests
            // Print the productId to the console
            console.log(`POST API Flow -> Product ID: ${productId}`);
            done();
          });
        });
    });
  });

  // GET /api/products/:id
  describe('GET /api/products/:id', () => {
    it('should get a specific product', (done) => {
      // Print the productId to the console
      console.log(`GET API flow -> Product ID: ${productId}`);
      chai
        .request(API_URL)
        .get(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${AUTH_TOKEN}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.product).to.have.property('id').eql(productId);
          done();
        });
    });

    it('should return 404 if product is not found', (done) => {
      chai
        .request(API_URL)
        .get(`/api/products/999999`)
        .set('Authorization', `Bearer ${AUTH_TOKEN}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  // PUT /api/products/:id
  describe('PUT /api/products/:id', () => {
    it('should update a product', (done) => {
      chai
        .request(API_URL)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${AUTH_TOKEN}`)
        .send({ name: 'Updated Product Laptop', price: 19.99 })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.product).to.have.property('name').eql('Updated Product Laptop');
          expect(res.body.product).to.have.property('price').eql(19.99);
          done();
        });
    });

    it('should return 404 if product to update is not found', (done) => {
      chai
        .request(API_URL)
        .put(`/api/products/999999`)
        .set('Authorization', `Bearer ${AUTH_TOKEN}`)
        .send({ name: 'Updated Product Laptop', price: 19.99 })
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  // DELETE /api/products/:id
  describe('DELETE /api/products/:id', () => {
    it('should delete a product', (done) => {
      chai
        .request(API_URL)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${AUTH_TOKEN}`)
        .end((err, res) => {
          expect(res).to.have.status(204); //Getting Response code 204 No Content
          done();
        });
    });
    it('should return 404 if product to delete is not found', (done) => {
        chai.request(API_URL)
        .delete(`/api/products/99999`)
        .set('Authorization', `Bearer ${AUTH_TOKEN}`)
        .end((err,res)=>{
            expect(res).to.have.status(404); // Sometime we get 429 Too Many Requests
            done();
        })
    });
  });
});






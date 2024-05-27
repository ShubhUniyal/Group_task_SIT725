const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Adjust the path if necessary
const db = require('../config/db');

const { expect } = chai;

chai.use(chaiHttp);

let server;

before(async function() {
    this.timeout(10000); // Increase timeout for before hook
    await db();
    server = app.listen(3003); // Use a different port for testing
});

after(() => {
    if (server) {
        server.close();
    }
});

describe('Threshold Controller', () => {
    it('should set threshold value successfully', (done) => {
        chai.request(app)
            .post('/api/threshold')
            .send({ thresholdValue: 70 })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body.message).to.equal('Threshold value set successfully');
                done();
            });
    });

    it('should update threshold value successfully', (done) => {
        chai.request(app)
            .put('/api/threshold')
            .send({ thresholdValue: 80 })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.equal('Threshold value updated successfully');
                done();
            });
    });

    it('should get the current threshold value', (done) => {
        chai.request(app)
            .get('/api/threshold')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.value).to.equal(80);
                done();
            });
    });
});

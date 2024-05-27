const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Adjust the path if necessary
const db = require('../config/db');

const { expect } = chai;

chai.use(chaiHttp);

let server;
let adminToken;

before(async function() {
    this.timeout(10000); // Increase timeout for before hook
    await db();
    server = app.listen(3001); // Use a different port for testing
});

after(() => {
    if (server) {
        server.close();
    }
});

describe('Auth Controller', () => {
    before(async () => {
        // Clean up the users collection
        const dbInstance = await db();
        await dbInstance.collection('users').deleteMany({});
    });

    it('should register an admin user successfully', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({ username: 'admin', password: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.text).to.include('Admin user created');
                done();
            });
    });

    it('should fail to register a non-admin user', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({ username: 'user', password: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(403);
                expect(res.text).to.include('Only admin can be created');
                done();
            });
    });

    it('should log in with valid credentials', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({ username: 'admin', password: 'admin' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('token');
                adminToken = res.body.token;
                done();
            });
    });

    it('should fail to log in with invalid credentials', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({ username: 'admin', password: 'wrongpassword' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.message).to.equal('Invalid credentials');
                done();
            });
    });
});

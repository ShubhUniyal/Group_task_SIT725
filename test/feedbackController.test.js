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
    server = app.listen(3002); // Use a different port for testing
});

after(() => {
    if (server) {
        server.close();
    }
});

describe('Feedback Controller', () => {
    before(async () => {
        // Clean up the feedback collection
        const dbInstance = await db();
        await dbInstance.collection('feedback').deleteMany({});
    });

    it('should delete feedback by name successfully', (done) => {
        const feedback = { name: 'Bob', feedback: 'Great service!', rating: '5' };
        chai.request(app)
            .post('/feedback')
            .send(feedback)
            .end((err, res) => {
                expect(res).to.have.status(200);
                chai.request(app)
                    .delete('/api/feedback/Bob')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.message).to.equal('Feedback deleted successfully');
                        done();
                    });
            });
    });

    it('should return an error when feedback to delete is not found', (done) => {
        chai.request(app)
            .delete('/api/feedback/NonExistentName')
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.message).to.equal('Feedback not found');
                done();
            });
    });
});

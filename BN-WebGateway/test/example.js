// var assert = require('assert');
// var validate = require('validator');
// var request = require('supertest');

// //------------------------------------------------------------------------
// describe("Test notes endpoint", function() {

//     //------------------------------------------------------------------------    
//     it("should respone with a note id", function(done) {
//         request(App.app)
//             .post('/api/notes')
//             .set('Content-Type', 'application/json')
//             .send({title: 'testB', message: 'HEHE'})
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .end((err, response) => {
//                 if (err) return done(err);
//                 assert(validate.isMongoId(response.body), 'response body is not a valid MongoId');
//                 done();
//             });
//     });

//     it("should return a list of notes", function(done) {
//         request(App.app)
//             .get('/api/notes')
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .end((err, response) => {
//                 if (err) return done(err);

//                 var notes = response.body;
//                 assert(Array.isArray(notes), 'Response body should be an array');
//                 notes.forEach((note) => {
//                     assert(note._id, 'A note is missing _id');
//                     assert(validate.isMongoId(note._id), 'Note _id is not valid MongoId')
//                     assert(note.title, 'A note is missing title');
//                 });
//                 done();
//             });
//     });
// });
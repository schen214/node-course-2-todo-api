const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// Testing Lifecycle Hook.. beforeEach allows us to run a callback before every "it" test case
beforeEach((done) => {
  // .remove() similar to mongodb native remove.. by passing it an empty object it will wipe all our current todos collection
  Todo.remove({}).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      // Required to use send() method after post to send data
      // Supertest will automatically convert it to JSON for you
      .send({text})
      .expect(200)
      // Setting up a custom expect assertion
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      // Passing a callback instead to check what was passed in MongoDB collection instead of done
      // errors can be from either the status code or the res.body.text property is not equal to 'text'.
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});

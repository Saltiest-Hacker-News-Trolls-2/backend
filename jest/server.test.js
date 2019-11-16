const app = require("../api/server");
const request = require("supertest");
const db = require("../database/dbConfig");

const authURL = "/api/auth";
const jokesURL = "/api/jokes";
let authToken = null;

describe("Tests for server.js", () => {
  beforeEach(async () => {
    // clear database
    await db("users").truncate();
  });

  test('Environment should be "test"', () => {
    expect(process.env.NODE_ENV).toBe("test");
  });

  describe("Tests for /register", () => {
    test("should create new user in db", async () => {
      const newUser = { username: "joe", password: "aaabbbccc123" };

      // db should be empty
      const beforeAdd = await db("users");
      expect(beforeAdd.length).toBe(0);

      // make POST request to add user to database
      const result = await request(app)
        .post(`${authURL}/register`)
        .send(newUser);

      //confirm response
      expect(result.status).toBe(200);
      expect(result.body.message).toBeDefined();
      expect(result.body.token).toBeDefined();
      // confirm that user was added to database
      const afterAdd = await db("users");
      expect(afterAdd.length).toBe(1);
      expect(afterAdd[0].username).toBe("joe");
      expect(afterAdd[0].password).not.toBe(newUser.password);
      expect(afterAdd[0].id).toBeDefined();
    });

    test("should return error if body is empty ", async () => {
      //make post to /register with empty body
      const result = await request(app)
        .post(`${authURL}/register`)
        .send({});
      //evaluate result
      expect(result.status).toBe(404);
      expect(result.body.errors).toBeDefined();
    });
  });

  describe("Tests for /login", () => {
    test("should return a token if password is correct", async () => {
      const joe = { username: "joe", password: "aaabbbccc123" };

      const joeEncrypted =
        "$2a$12$9ldHxiMULOFmqM9RZCMmsOn14MSHL3AKllmIt5Q45jRrgNYOQDoJO";

      // db should be empty
      const beforeAdd = await db("users");
      expect(beforeAdd.length).toBe(0);

      //  add user to database
      await db("users").insert({ username: "joe", password: joeEncrypted });
      //make sure user was added
      const dbUser = await db("users").first();

      expect(dbUser.username).toBe("joe");

      // try to login
      const result = await request(app)
        .post(`${authURL}/login`)
        .send(joe);

      //confirm response
      expect(result.status).toBe(200);
      expect(result.body.message).toBeDefined();
      expect(result.body.token).toBeDefined();

      authToken = result.body.token;
    });

    test("should return error if password is incorrect", async () => {
      const joe = { username: "joe", password: "aaabbbccc123" };

      const joeEncrypted =
        "$2a$12$9ldHxiMULOFmqM9RZCMmsOn14MSHL3AKllmIt5Q45jRrgNYOQDoJO";

      // db should be empty
      const beforeAdd = await db("users");
      expect(beforeAdd.length).toBe(0);

      //  add user to database
      await db("users").insert({ username: "joe", password: joeEncrypted });

      //make sure user was added
      const dbUser = await db("users").first();

      expect(dbUser.username).toBe("joe");

      // try to login
      const result = await request(app)
        .post(`${authURL}/login`)
        .send({ username: "joe", password: "potato1" });

      //confirm response
      expect(result.status).toBe(401);
      expect(result.body.message).toBe("Invalid Credentials");
      expect(result.body.token).not.toBeDefined();
    });
  });

  describe("Test for /jokes", () => {
    test("Should not allow access to path without token", async () => {
      // make request
      const jokes = await request(app).get(`${jokesURL}/`);

      expect(jokes.status).toBe(400);
      expect(jokes.body.message).toBe("Not Authorized");
    });

    test("Should return some jokes", async () => {
      // make request
      const jokes = await request(app)
        .get(`${jokesURL}/`)
        .set("authorization", authToken);

      expect(jokes.status).toBe(200);
      expect(jokes.body).toBeInstanceOf(Array);
    });
  });
});

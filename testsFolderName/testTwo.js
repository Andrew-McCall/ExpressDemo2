const mongoose = require("mongoose")
const chai = require("chai");
chai.use(require("chai-http"))
const {trainerModel} = require("../routes/mongoose.js")

const {server} = require("../index.js");

after("Close Server", function(){
    server.close();
})

describe.only("chaiHttp", function(){

    it("hello", function() {
        chai.request(server).get("/hello").end((err, res) => {
            chai.expect(err).to.be.null;
            chai.expect(res.status).to.equal(200)
            chai.expect(res.text).to.equal("Hello!")
        })
    })

})

const testData = {
    "firstName": "andrew",
    "surname": "mccall",
    "age": 20,
    "hobbies": ["coding"],
    "courses": []
}

describe.only("mongoose", function(){

    this.beforeAll("Test Database" ,async function(){
        await mongoose.connection.close()
        await mongoose.connect("mongodb://127.0.0.1:27017/QATest")
    })

    this.beforeEach("Test Data", async function(){
        // await mongoose.connection.db.dropCollection('trainers');
        await trainerModel.deleteMany({});
        await trainerModel.create(testData)
    })

    it.only("/getAll", function(){
        chai.request(server).get("/mongoose/getAll").end((err, res) => {
            chai.expect(err).to.be.null;
            chai.expect(res.status).to.equal(200);

            chai.expect(res.body.length).to.equal(1);

            chai.expect(res.body[0].firstName).to.equal(testData.firstName);
            chai.expect(res.body[0].surname).to.equal(testData.surname);
            chai.expect(res.body[0].age).to.equal(testData.age);
            // ...
        })
    })

    it("/create", function(){

        const trainer = {
            "firstName": "andrew",
            "surname": "mccall",
            "age": 20,
            "hobbies": ["coding"],
            "courses": []
        }
        
        chai.request(server).put("/mongoose/create").send(trainer).end( (err, res) => {
            chai.expect(err).to.be.null;

            chai.expect(res.status).to.equal(201)
            chai.expect(res.body).to.be.not.equal({});

            /// Lazy Way
            trainer._id = res.body._id;
            trainer.__v = res.body.__v;
            chai.expect(JSON.stringify(res.body) === JSON.stringify(trainer)).to.be.true 

            
            /// Perfect Theory Fails...... Arg!
            // chai.expect(Object.is(res.body, trainer)).to.be.true

            /// Long Way, And very correct way!
            chai.expect(res.body.firstName).to.be.equal("andrew")
            chai.expect(res.body.surname).to.equal("mccall")
            // ...
        })
    })

})
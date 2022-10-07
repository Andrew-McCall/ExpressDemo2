const mongoose = require("mongoose")
const chai = require("chai");
chai.use(require("chai-http"));

const server = require("../index.js");

const {trainerModel} = require("../routes/mongoose.js");


describe("Trainers API", function() {

    const TestTrainer = {
        "firstName": "andrew",
        "surname": "mccall",
        "age": 20,
        "hobbies": ["coding"],
        "courses": []
    }

    this.beforeAll("Test Database", async function(){
        await mongoose.connection.close();
        await mongoose.connect("mongodb://127.0.0.1:27017/QATest")
    })

    this.beforeEach("Test Data", async function(){
        await trainerModel.deleteMany({})
        await trainerModel.create(TestTrainer)
    })

    this.afterAll("Shut Down", function(){
        server.close();
        mongoose.connection.close();
    })
    
    it("/getAll", function(){
        chai.request(server).get("/mongoose/getAll").end((err, res) => {
            chai.expect(err).to.be.null;
            chai.expect(res.status).to.eql(200)

            chai.expect(res.body.length).to.eql(1);

            chai.expect(res.body[0].firstName).to.eql(TestTrainer.firstName)
            chai.expect(res.body[0].surname).to.eql(TestTrainer.surname)
            chai.expect(res.body[0].courses).to.eql(TestTrainer.courses)
            chai.expect(res.body[0].hobbies).to.eql(TestTrainer.hobbies)
            chai.expect(res.body[0].age).to.eql(TestTrainer.age)
        })
    })

    it("/update", function(){
        return new Promise((done) => {
            const body = {firstName:"Not Andrew", surname:"Not McCall"}

            trainerModel.findOne({}).then(t => {
                chai.request(server).post(`/mongoose/update/${t.id}`).send(body).then((res) => {
                    chai.expect(res.status).to.eql(200)  
    
                    chai.expect(res.body).to.have.property("New");
                    chai.expect(res.body).to.have.property("Old");
    
                    chai.expect(res.body.New.firstName).to.eql(body.firstName);
                    chai.expect(res.body.Old.firstName).to.eql(TestTrainer.firstName);
    
                    chai.expect(res.body.New.surname).to.eql(body.surname);
                    chai.expect(res.body.Old.surname).to.eql(TestTrainer.surname);
    
                    chai.expect(res.body.New.age).to.eql(res.body.Old.age);
                    chai.expect(res.body.New.hobbies).to.eql(res.body.Old.hobbies);
                    done()
                })
            })
        })
    })

})


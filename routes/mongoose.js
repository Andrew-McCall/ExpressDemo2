const router = require("express").Router();
const {Schema, model} = require("mongoose");

const courseSchema = new Schema({
    name:{type:String, required:true},
    courseid:String,
})

const trainerSchema = new Schema({
    firstName:{type:String, required:true},
    surname:{type:String, required:true},
    age:{type:Number, required:true},
    hobbies:[String],
    courses: [courseSchema]
})

const trainerModel = model("trainers", trainerSchema);

router.get("/getAll", (req, res, next) => {
    trainerModel.find({}).then(trainers => {
        res.status(200).json(trainers)
    }).catch(next)
})

router.get("/getOne/:id", (req, res, next) => {
    trainerModel.findById(req.params.id).then(trainer => {
        res.status(200).json(trainer)
    }).catch(next)
})

router.get("/getCourseById/:id", (req, res, next) => {
    trainerModel.find({"courses.courseid": req.params.id }).then(trainer => {
        res.status(200).json(trainer)
    }).catch(next)
})

router.get("/getTrainerByCourseName/:name", (req, res, next) => {
    trainerModel.find({"courses.name":req.params.name}).then(trainers => {
        if (trainers.length > 0){
            res.status(200).json(trainers)
        }else{
            res.status(400).send(`No Courses named "${req.params.name}"`)
        }
    }).catch(next)
})

router.get("/getQuery", (req, res, next) => {
    trainerModel.find(req.body).then(trainers => {
        res.status(200).json(trainers)
    }).catch(next)
})

router.get("/getByName/:firstName/:surname", (req, res, next) => {
    trainerModel.findOne({"firstName": req.params.firstName, "surname": req.params.surname}).then(trainer => {
        if (trainer){
            res.status(200).json(trainer)
        }else{
            res.status(400).json(new Error("Invaild Id").stack)
        }
    }).catch(next)
})

router.put("/create", (req, res, next) => {
    trainerModel.create(req.body).then(trainer => {
        res.status(201).json(trainer)
    }).catch(next)

    // new trainerModel(req.body).save().then((trainer) => {
    //     res.status(201).json(trainer)
    // }).catch(next)
})

router.post("/update/:id", (req, res, next) => {
    trainerModel.findByIdAndUpdate(req.params.id, req.body).then((Old) =>{
        trainerModel.findById(req.params.id).then((New) => {
            res.status(200).json({Old, New})
        })
     }).catch(next) 

    // trainerModel.findById({"_id":req.params.id}).then((trainer) => {
    //     trainer.firstName = req.body.firstName;
    //     // ...

    //     trainer.save().then(() => {
    //         res.status(200).json(trainer)
    //     })
        
    // }).catch(next)
})

router.delete("/deleteOne/:id", (req, res, next) => {

    trainerModel.deleteOne({"_id":req.params.id}).then( (r) => {
        res.status(200).json(r)
    }).catch(next)

})

module.exports = router;

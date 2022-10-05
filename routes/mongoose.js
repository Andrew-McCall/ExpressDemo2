const router = require("express").Router();
const {Schema, model} = require("mongoose");

const trainerSchema = new Schema({
    firstName:{type:String, required:true},
    surname:{type:String, required:true},
    age:{type:Number, required:true},
    hobbies:[String]
})

const trainerModel = model("trainers", trainerSchema);

router.get("/getAll", (req, res, next) => {
    trainerModel.find({}).then(trainers => {
        res.status(200).json(trainers)
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
    trainerModel.findByIdAndUpdate({"_id":req.params.id}, req.body).then((Old) =>{
        trainerModel.findById({"_id":req.params.id}).then((New) => {
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

module.exports = router;

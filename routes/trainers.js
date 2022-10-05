const router = require("express").Router();

var trainers = [{id:0, firstName:"andrew", surname:"McCall", "age":25, hobbies:["Gaming", "Reading","Coding"]}]
var id = 0;

router.get("/getAll", (req, res) => {
    res.status(200).json(trainers)
})

router.get("/getOne/:id", (req, res, next) => {
    for (const t of trainers) {
        if (t.id == req.params.id){
            res.status(200).json(t)
            return;
        }
    }
    
    next(new Error("Index invaild"))
})

router.get("/getOneByName/:firstName/:surname", (req, res, next) => {
    for (const t of trainers) {
        if (t.firstName === req.params.firstName && t.surname === req.params.surname){
            res.status(200).json(t)
            return;
        }
    }
    
    next(new Error("Invaild name"))
})

router.delete("/deleteOne/:id", (req, res, next) => {
    try{
        trainers = trainers.filter(t => (t.id != req.params.id))
        res.status(200).json(trainers)
    }catch (err){
        next(new Error("Index invaild"))
    }
})

router.put("/create", (req, res, next) => {
    if (req.body.firstName && req.body.surname){
        req.body.id = ++id;
        trainers.push(req.body)
        res.status(201).json(req.body)
    }else{
        next(new Error('Expected {"firstName":"{name}", "surname":"{name}"}'))
    }
})

router.post("/update/:id", (req, res,next) => {

    const index = trainers.indexOf(trainers.find(t => t.id == req.params.id))

    if(index === -1){
        next(new Error('Invaild Index'))
    }else{
        trainers[index] = {...trainers[index], ...req.body}

        res.status(200).json(trainers[index])
    }
    
})

router.patch("/updateAttribute/:id", (req, res, next)=> {
    if (req.query !== {}){

        const index = trainers.indexOf(trainers.find(t => t.id == req.params.id))

        if(index === -1){
            next(new Error('Invaild Index'))
        }else{
            for (const key of Object.keys(req.query)) {
                trainers[index][key] = req.query[key]
            }
            res.status(200).json(trainers[index])
        }

    }else{
        next(new Error('Missing "/updateAttribute/:id?key=value"'))
    }
})


module.exports = router;
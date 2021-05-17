const router = require("express").Router();
const mongoose = require("mongoose");



const itemsSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    id: {
        required: true,
        type: String
    },

}, { timestamps: true })

const Item = mongoose.model("Items", itemsSchema);


router.route("/create").post((req, res) => {
    console.log(req.body)
    Item({ name: req.body.name, id: req.body.id }).save().then(() => res.json("True")).catch(err => res.json(err));
})
router.route("/").get((req,res)=>{
    return res.json("hello")
})

router.route("/search").get((req, res) => {
    Item.aggregate([
        {
            $search: {
                "autocomplete": {
                    "query": req.query.search,
                    "path": "name",
                }
            }
        },
        {
            $limit: 10
        },
        {
            $project: {
                "_id": 0,
                "name": 1,
                "id": 1
            }
        }
    ]).then((items) => res.json(items)).catch((e) => res.json(e))
});
module.exports = router;


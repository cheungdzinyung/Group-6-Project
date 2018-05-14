const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const upload = multer({ dest: './files' });


class ActivityRouter {


  constructor(activityService, knex) {
    this.uploadDirectory = path.join(__dirname, './', "files");
    this.activityService = activityService;
    this.knex = knex;
  }

  route() {
    let router = express.Router();
    // router.post("/", this.post.bind(this));
    router.get("/", this.get.bind(this));
    router.post("/upload", upload.single('profile'), this.add.bind(this));
    return router;
  }

  // post(req, res) {
  //   console.log(req.body, req.user);
  //   return this.activityService
  //     .make(req.body, req.user)
  //     .then(data => res.status(200).json({ data: data }))
  //     .catch(err => res.status(500).json(err));
  // }

  get(req, res) {
    res.sendFile(path.join(__dirname, 'activity.html'));
  }



  add(req, res) {
    this.writeFile(req.file.originalname, req.file.buffer)

      .then((pathName)=>{

        var subquery1 = this.knex
          .select("id")
          .from("cities")
          .where("name", req.body.cities);
        var subquery2 = this.knex
          .select("id")
          .from("typeOfActivities")
          .where("name", req.body.typeOfActivities);

        console.log("path:", pathName)
        console.log(req.body)

        return this.knex("activities").insert({
          name: req.body.name,
          address: req.body.address,
          description: req.body.description,
          photo:pathName,
          reviewing_status: false,
          typeOfActivities_id: subquery2,
          cities_id: subquery1,
          is_active: true
        });

      })
      .then((pathName) => {

         res.redirect('../../')
        // res.json({path: pathName,name:req.body.name,description:req.body.description,address:req.body.address,typeOfActivities:req.body.typeOfActivities,cities:req.body.cities})
      })
      .catch(err => {
        res.status(500).json(err);
      })
  }


  writeFile(name, body) {
    return new Promise((resolve, reject) => {
      const pathName = path.join(this.uploadDirectory, name);
      fs.writeFile(pathName, body, err => {
        if (err) {
          return reject(err);
        }
       // return this.knex("activities").insert({ photo: pathName}).then((result, err) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          else {
            console.log(pathName)
            resolve (pathName);
          }return pathName;
        });
      })
    };
  }

//   readFile(file) {
//     return (new Promise((resolve, reject) => {
//       fs.readFile(path.join(this.uploadDirectory, file), (err, body) => {
//         if (err) {
//           console.log(err);
//           return reject(err);
//         }
//         resolve(body);
//       });
//     }));
//   }
// }

module.exports = ActivityRouter;

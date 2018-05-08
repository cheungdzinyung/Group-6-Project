const fs = require("fs-extra");
const path = require("path");

exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  let Activities = fs.readJsonSync(path.join(__dirname, "/activities.json"));
  return knex("cities")
    .del()
    .then(() => {
      return knex("typeOfActivities").del();
    })
    .then(() => {
      return knex("cities").del();
    })
    .then(() => {
        return knex("activities").del();
      })
    .then(() => {
      let Cities = fs.readJsonSync(path.join(__dirname, "/cityList.json"));
      return knex("cities").insert(Cities);
    })
    .then(() => {
      let TypesOfActivities = fs.readJsonSync(
        path.join(__dirname, "/attractionTypeList.json")
      );
      return knex("typeOfActivities").insert(TypesOfActivities);
    })
    .then(() => {
      let activityArray = [];
      Activities.forEach(activity => {
        let typeOfActivity = activity.type;
        activityArray.push(createActivity(knex, activity, typeOfActivity));
      });
      return Promise.all(activityArray);
    });
};

const createActivity = (knex, activity, typeOfActivity) => {
  return knex("typeOfActivities")
    .where("name", typeOfActivity)
    .first()
    .then(typeOfActivityRecord => {
      return knex("activities").insert({
        name: activity.name,
        is_active: activity.is_active,
        typeOfActivities_id: typeOfActivityRecord.id,
        address: activity.address,
        description: activity.description,
        photo: activity.photo
      });
    });
};
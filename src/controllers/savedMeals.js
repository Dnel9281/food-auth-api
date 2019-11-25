'use strict';
// Models and database function helpers
const sequelize = require('../models/sequelize').sequelize;
const SavedMeal = require('../models/sequelize').saved_meal;
const User = require('../models/sequelize').user;
const Meal = require('../models/sequelize').meal;
const Like = require('../models/sequelize').like;
const MealPic = require('../models/sequelize').meal_pic;

module.exports = {
  findAllAtoZ: async (req, res) => {
    try {
      let savedMeals = await SavedMeal.findAndCountAll({
        where: { userId: req.decoded.id },
        offset: req.query.offset,
        limit: req.query.limit,
        order: [[sequelize.fn('lower', sequelize.col('name'))]],
        attributes: [],
        include: [
          { 
            model: Meal, 
            attributes: ['id', 'difficulty', 'name', 'cookTime', 'creatorId'], 
            duplicating: false, 
            include: [
              { model: User, as: "creator", attributes: ['username'], duplicating: false },
              { model: Like, attributes: ['userId'], duplicating: false },
              { model: MealPic, as: 'mealPic', attributes: ['mealPicName'], duplicating: false }
            ]
          }
        ]
      });

      if (savedMeals.rows.length === 0) return res.status(404).json({ message: 'You have not saved any meals.' });

      let meals = savedMeals.rows.reduce((mealArray, object) => {
        mealArray.push(object.dataValues.meal.dataValues);
        return mealArray;
      }, []);

      savedMeals.rows = meals;

      res.status(200).json(savedMeals);
    } catch (err) {
      res.status(500).json({ message: 'There was an error getting your list of saved meals.' });
    }
  },

  findAllZtoA: async (req, res) => {
    try {
      let savedMeals = await SavedMeal.findAndCountAll({
        where: { userId: req.decoded.id },
        offset: req.query.offset,
        limit: req.query.limit,
        order: [[sequelize.fn('lower', sequelize.col('name')), 'DESC']],
        attributes: [],
        include: [
          { 
            model: Meal, 
            attributes: ['id', 'difficulty', 'name', 'cookTime', 'creatorId'], 
            duplicating: false, 
            include: [
              { model: User, as: "creator", attributes: ['username'], duplicating: false },
              { model: Like, attributes: ['userId'], duplicating: false },
              { model: MealPic, as: 'mealPic', attributes: ['mealPicName'], duplicating: false }
            ]
          }
        ]
      });

      if (savedMeals.rows.length === 0) return res.status(404).json({ message: 'You have not saved any meals.' });

      let meals = savedMeals.rows.reduce((mealArray, object) => {
        mealArray.push(object.dataValues.meal.dataValues);
        return mealArray;
      }, []);

      savedMeals.rows = meals;

      res.status(200).json(savedMeals);
    } catch (err) {
      res.status(500).json({ message: 'There was an error getting your list of saved meals.' });
    }
  },

  saveMeal: async (req, res) => {
    try {
      let savedMeal = await SavedMeal.create({
        mealId: req.body.mealId,
        userId: req.decoded.id
      });

      if (savedMeal) {
        res.status(201).json({ message: 'Meal successfully saved.' });
      } else {
        throw Error();
      }
    } catch (err) {
      res.status(500).send({ message: 'There was an error saving this meal.' });
    }
  },

  unsaveMeal: async (req, res) => {
    try {
      let unsavedMeal = await SavedMeal.destroy({
        where: {
          mealId: req.body.mealId,
          userId: req.decoded.id
        }
      });

      if (unsavedMeal) {
        res.status(200).json({ message: "Meal successfully unsaved." });
      } else {
        throw Error();
      }
    } catch (err) {
      res.status(500).json({ message: "There was an error unsaving this meal." });
    }
  }
};
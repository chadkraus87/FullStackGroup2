const sequelize = require('../config/connection');
const { User, Spot } = require('../models');
const userData = require('./userData.json');
const spotData = require('./spotData.json');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(userData, {
      individualHooks: true,
      returning: true,
    });

    const randomUserId = () => users[Math.floor(Math.random() * users.length)].id;

    const spotEntries = spotData.map((spot) => ({
      ...spot,
      user_id: randomUserId(),
    }));

    await Spot.bulkCreate(spotEntries);

    console.log('Database seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
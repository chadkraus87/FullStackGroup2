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

    const sampleSpots = [
      { name: 'Spot 1', location: 'Location 1', venueType: 'Type 1', user_id: randomUserId() },
      { name: 'Spot 2', location: 'Location 2', venueType: 'Type 2', user_id: randomUserId() },
      { name: 'Spot 3', location: 'Location 3', venueType: 'Type 3', user_id: randomUserId() },
    ];

    await Spot.bulkCreate(sampleSpots);

    console.log('Database seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

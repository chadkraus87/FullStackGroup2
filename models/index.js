const User = require('./User');
const Spot = require('./Spot');

User.hasMany(Spot, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Spot.belongsTo(User, {
  foreignKey: 'user_id'
});

module.exports = { User, Spot };
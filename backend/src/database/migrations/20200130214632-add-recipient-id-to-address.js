module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('address', 'recipient_id', {
      type: Sequelize.INTEGER,
      references: { model: 'recipient', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('address', 'recipient_id');
  },
};

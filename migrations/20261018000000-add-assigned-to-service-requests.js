'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ServiceRequests', 'assignedTo', {
      type: Sequelize.INTEGER, allowNull: true,
      references: { model: 'Users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL'
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('ServiceRequests', 'assignedTo');
  }
};

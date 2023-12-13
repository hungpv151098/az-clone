'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('shares', {
      fields: ['user_id', 'post_id'],
      type: 'unique',
      name: 'user_post_unique_key',
    });
    await queryInterface.addConstraint('likes', {
      fields: ['user_id', 'likeable_id', 'likeable_type'],
      type: 'unique',
      name: 'user_like_unique_key',
    });
    await queryInterface.addConstraint('followers', {
      fields: ['follower_id', 'following_id'],
      type: 'unique',
      name: 'follower_following_unique',
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('shares', 'user_post_unique_key');
    await queryInterface.removeConstraint('likes', 'user_like_unique_key');
    await queryInterface.removeConstraint('followers', 'follower_following_unique');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};

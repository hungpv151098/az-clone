'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('comments', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'users_comments_fkey',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
    await queryInterface.addConstraint('comments', {
      fields: ['post_id'],
      type: 'foreign key',
      name: 'posts_comments_fkey',
      references: {
        table: 'posts',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
    await queryInterface.addConstraint('shares', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'users_shares_fkey',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
    await queryInterface.addConstraint('shares', {
      fields: ['post_id'],
      type: 'foreign key',
      name: 'posts_shares_fkey',
      references: {
        table: 'posts',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
    await queryInterface.addConstraint('notifications', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'users_notifications_fkey',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
    await queryInterface.addConstraint('notifications', {
      fields: ['admin_id'],
      type: 'foreign key',
      name: 'admin_users_notifications_fkey',
      references: {
        table: 'admin_users',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
    await queryInterface.addConstraint('notifications', {
      fields: ['fire_user_id'],
      type: 'foreign key',
      name: 'fire_users_notifications_fkey',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
    await queryInterface.addConstraint('reports', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'users_reports_fkey',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
    await queryInterface.addConstraint('reports', {
      fields: ['post_id'],
      type: 'foreign key',
      name: 'posts_reports_fkey',
      references: {
        table: 'posts',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
    await queryInterface.addConstraint('post_tags', {
      fields: ['post_id'],
      type: 'foreign key',
      name: 'posts_post_tags_fkey',
      references: {
        table: 'posts',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
    await queryInterface.addConstraint('post_tags', {
      fields: ['tag_id'],
      type: 'foreign key',
      name: 'tags_post_tags_fkey',
      references: {
        table: 'tags',
        field: 'id',
      },
    });
    await queryInterface.addConstraint('likes', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'users_likes_fkey',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
    await queryInterface.addConstraint('chat_messages', {
      fields: ['sender_user_id'],
      type: 'foreign key',
      name: 'sender_users_chat_messages_fkey',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
    await queryInterface.addConstraint('chat_messages', {
      fields: ['receiver_user_id'],
      type: 'foreign key',
      name: 'receiver_users_chat_messages_fkey',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });

    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('comments', 'user_id');
    await queryInterface.removeConstraint('comments', 'post_id');
    await queryInterface.removeConstraint('shares', 'user_id');
    await queryInterface.removeConstraint('shares', 'post_id');
    await queryInterface.removeConstraint('notifications', 'user_id');
    await queryInterface.removeConstraint('notifications', 'admin_id');
    await queryInterface.removeConstraint('notifications', 'fire_user_id');
    await queryInterface.removeConstraint('reports', 'user_id');
    await queryInterface.removeConstraint('reports', 'post_id');
    await queryInterface.removeConstraint('post_tags', 'post_id');
    await queryInterface.removeConstraint('post_tags', 'tag_id');
    await queryInterface.removeConstraint('likes', 'user_id');
    await queryInterface.removeConstraint('chat_messages', 'sender_user_id');
    await queryInterface.removeConstraint('chat_messages', 'receiver_user_id');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};

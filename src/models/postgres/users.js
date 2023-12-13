const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'users',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      fireUid: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'fire_uid',
      },
      fullName: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'full_name',
      },
      userName: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'user_name',
      },
      invitedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        references: {
          model: 'users',
          key: 'user_name',
        },
        field: 'invited_by',
      },
      balance: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
      balanceLock: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0,
        field: 'balance_lock',
      },
      countryCode: {
        type: DataTypes.STRING(10),
        allowNull: true,
        references: {
          model: 'coutries',
          key: 'code',
        },
        field: 'country_code',
      },

      verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'verified_at',
      },
      deviceToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'device_token',
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'phone_number',
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      isVerify: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        field: 'isVerify',
      },
      provider: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      adminId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'admin_users',
          key: 'id',
        },
        field: 'admin_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      avatar: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      biography: {
        type: DataTypes.STRING(455),
        allowNull: true,
      },
      isBlueTick: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_blue_tick',
      },
      isBan: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_ban',
      },
      postBlockedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'post_blocked_at',
      },
      isPopular: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0,
        field: 'is_popular',
      },
    },
    {
      sequelize,
      tableName: 'users',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: 'users_email_key',
          unique: true,
          fields: [{ name: 'email' }],
        },
        {
          name: 'users_fire_uid_key',
          unique: true,
          fields: [{ name: 'fire_uid' }],
        },
        {
          name: 'users_invited_by_idx',
          fields: [{ name: 'invited_by' }],
        },
        {
          name: 'users_phone_number_key',
          unique: true,
          fields: [{ name: 'phone_number' }],
        },
        {
          name: 'users_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'users_user_name_key',
          unique: true,
          fields: [{ name: 'user_name' }],
        },
      ],
    }
  );
};

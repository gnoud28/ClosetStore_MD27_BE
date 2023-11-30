const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Notification.init(sequelize, DataTypes);
}

class Notification extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    notification_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'Users',
        key: 'user_id'
      }
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Notification',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "notification_id" },
        ]
      },
      {
        name: "fk_user_notification",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}

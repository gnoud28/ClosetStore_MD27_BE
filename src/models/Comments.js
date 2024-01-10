const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Comments.init(sequelize, DataTypes);
}

class Comments extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    comment_id: {
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
    product_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'Product',
        key: 'product_id'
      }
    },
    comment_text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    comment_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Comments',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "comment_id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "product_id",
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
    ]
  });
  }
}

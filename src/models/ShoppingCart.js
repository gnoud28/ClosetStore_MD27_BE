const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return ShoppingCart.init(sequelize, DataTypes);
}

class ShoppingCart extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    cart_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'Users',
        key: 'user_id'
      }
    },
    product_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'Product',
        key: 'product_id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ShoppingCart',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "cart_id" },
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

const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return OrderDetails.init(sequelize, DataTypes);
}

class OrderDetails extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    order_detail_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'Order',
        key: 'order_id'
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
    price_per_unit: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'OrderDetails',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "order_detail_id" },
        ]
      },
      {
        name: "order_id",
        using: "BTREE",
        fields: [
          { name: "order_id" },
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

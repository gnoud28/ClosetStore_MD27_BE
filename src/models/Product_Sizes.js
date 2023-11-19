const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Product_Sizes.init(sequelize, DataTypes);
}

class Product_Sizes extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    product_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Product',
        key: 'product_id'
      }
    },
    size_name: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'Product_Sizes',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "product_id" },
          { name: "size_name" },
        ]
      },
    ]
  });
  }
}

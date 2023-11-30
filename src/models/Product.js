const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Product.init(sequelize, DataTypes);
}

class Product extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    product_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'ProductCategory',
        key: 'category_id'
      }
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Product',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
      {
        name: "category_id",
        using: "BTREE",
        fields: [
          { name: "category_id" },
        ]
      },
    ]
  });
  }
}

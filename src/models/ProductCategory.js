const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return ProductCategory.init(sequelize, DataTypes);
}

class ProductCategory extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    category_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    category_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ProductCategory',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "category_id" },
        ]
      },
    ]
  });
  }
}

const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Banner.init(sequelize, DataTypes);
}

class Banner extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    banner_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ImagesUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Banner',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "banner_id" },
        ]
      },
    ]
  });
  }
}
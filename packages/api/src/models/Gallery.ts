import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Artwork from './Artwork';

class Gallery extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public createdBy!: number;
}

Gallery.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    description: {
      type: new DataTypes.STRING(256),
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'galleries',
    sequelize,
  },
);

Gallery.belongsToMany(Artwork, { through: 'GalleryArtworks' });

export default Gallery;

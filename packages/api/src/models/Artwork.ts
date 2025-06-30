import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface ArtworkAttributes {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  createdBy: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ArtworkCreationAttributes extends Optional<ArtworkAttributes, 'id'> {}

class Artwork
  extends Model<ArtworkAttributes, ArtworkCreationAttributes>
  implements ArtworkAttributes
{
  public id!: number;
  public title!: string;
  public description!: string;
  public imageUrl!: string;
  public createdBy!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Artwork.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'artworks',
  },
);

export default Artwork;

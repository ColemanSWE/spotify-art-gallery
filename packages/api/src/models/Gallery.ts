import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface GalleryAttributes {
  id: number;
  userId: number;
  title: string;
  description: string;
  roomType: 'achievements' | 'projects' | 'influences' | 'skills' | 'experience' | 'personal';
  isPublic: boolean;
  theme: 'brutalist' | 'minimal' | 'dark' | 'warm';
  visitCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface GalleryCreationAttributes extends Optional<GalleryAttributes, 'id' | 'visitCount' | 'createdAt' | 'updatedAt'> {}

class Gallery extends Model<GalleryAttributes, GalleryCreationAttributes> implements GalleryAttributes {
  public id!: number;
  public userId!: number;
  public title!: string;
  public description!: string;
  public roomType!: 'achievements' | 'projects' | 'influences' | 'skills' | 'experience' | 'personal';
  public isPublic!: boolean;
  public theme!: 'brutalist' | 'minimal' | 'dark' | 'warm';
  public visitCount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Gallery.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    roomType: {
      type: DataTypes.ENUM('achievements', 'projects', 'influences', 'skills', 'experience', 'personal'),
      allowNull: false,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    theme: {
      type: DataTypes.ENUM('brutalist', 'minimal', 'dark', 'warm'),
      allowNull: false,
      defaultValue: 'brutalist',
    },
    visitCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'galleries',
  }
);

export default Gallery;


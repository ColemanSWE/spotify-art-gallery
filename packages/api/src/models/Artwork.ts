import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ArtworkAttributes {
  id: number;
  userId: number;
  galleryId: number;
  title: string;
  description: string;
  category: 'achievement' | 'project' | 'influence' | 'skill' | 'experience' | 'personal' | 'other';
  imageUrl: string;
  metadata?: {
    date?: string;
    location?: string;
    tags?: string[];
    externalLink?: string;
    techStack?: string[];
    role?: string;
    duration?: string;
  };
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

interface ArtworkCreationAttributes extends Optional<ArtworkAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Artwork extends Model<ArtworkAttributes, ArtworkCreationAttributes> implements ArtworkAttributes {
  public id!: number;
  public userId!: number;
  public galleryId!: number;
  public title!: string;
  public description!: string;
  public category!: 'achievement' | 'project' | 'influence' | 'skill' | 'experience' | 'personal' | 'other';
  public imageUrl!: string;
  public metadata!: {
    date?: string;
    location?: string;
    tags?: string[];
    externalLink?: string;
    techStack?: string[];
    role?: string;
    duration?: string;
  };
  public position!: {
    x: number;
    y: number;
    z: number;
  };
  public rotation!: {
    x: number;
    y: number;
    z: number;
  };
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    galleryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'galleries',
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
    category: {
      type: DataTypes.ENUM('achievement', 'project', 'influence', 'skill', 'experience', 'personal', 'other'),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    position: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: { x: 0, y: 0, z: 0 },
    },
    rotation: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: { x: 0, y: 0, z: 0 },
    },
  },
  {
    sequelize,
    tableName: 'artworks',
  }
);

export default Artwork;

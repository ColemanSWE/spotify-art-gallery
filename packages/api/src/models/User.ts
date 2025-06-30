import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import sequelize from '../config/database';

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password?: string;
  spotifyId?: string;
  spotifyAccessToken?: string;
  spotifyRefreshToken?: string;
  spotifyTokenExpiry?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'password'> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public email!: string;
  public password?: string;
  public spotifyId?: string;
  public spotifyAccessToken?: string;
  public spotifyRefreshToken?: string;
  public spotifyTokenExpiry?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Only initialize the model if sequelize is available
if (sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
      spotifyId: {
        type: DataTypes.STRING(128),
        allowNull: true,
        unique: true,
      },
      spotifyAccessToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      spotifyRefreshToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      spotifyTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'users',
    },
  );
}

export default User;

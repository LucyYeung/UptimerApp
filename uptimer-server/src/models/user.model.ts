import { IUserDocument } from '@app/interfaces/user.interface';
import { sequelize } from '@app/server/database';
import { compare, hash } from 'bcryptjs';
import { DataTypes, Model, ModelDefined, Optional } from 'sequelize';

const SALT_ROUNDS = 10;

interface UserModelInstanceMethods extends Model {
  prototype: {
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    hashPassword(password: string): Promise<string>;
  };
}

type UserCreationAttributes = Optional<IUserDocument, 'id' | 'createdAt'>;

const UserModel: ModelDefined<IUserDocument, UserCreationAttributes> &
  UserModelInstanceMethods = sequelize.define(
  'users',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facebookId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    indexes: [{ unique: true, fields: ['email'] }, { fields: ['username'] }],
  },
) as ModelDefined<IUserDocument, UserCreationAttributes> &
  UserModelInstanceMethods;

UserModel.addHook('beforeCreate', async (auth: Model) => {
  if (auth.dataValues.password !== undefined) {
    const hashedPassword: string = await hash(
      auth.dataValues.password,
      SALT_ROUNDS,
    );
    auth.dataValues.password = hashedPassword;
  }
});

UserModel.prototype.comparePassword = async (
  password: string,
  hashedPassword: string,
) => compare(password, hashedPassword);

UserModel.prototype.hashPassword = async (password: string): Promise<string> =>
  hash(password, SALT_ROUNDS);

export { UserModel };

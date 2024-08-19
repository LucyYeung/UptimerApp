import { IUserDocument } from '@app/interfaces/user.interface';
import { UserModel } from '@app/models/user.model';
import { omit, toLower, upperFirst } from 'lodash';
import { Op } from 'sequelize';

export const createNewUser = async (data: IUserDocument) => {
  try {
    const result = await UserModel.create(data);
    const userData = omit(result.dataValues, ['password']);
    return userData;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserByUserNameOrEmail = async (
  username: string,
  email: string,
) => {
  try {
    const user = (await UserModel.findOne({
      raw: true,
      where: {
        [Op.or]: [
          { username: upperFirst(username) },
          { email: toLower(email) },
        ],
      },
    })) as unknown as IUserDocument;
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserBySocialId = async (
  socialId: string,
  email: string,
  type: string,
) => {
  try {
    const user = (await UserModel.findOne({
      raw: true,
      where: {
        [Op.or]: [
          {
            ...(type === 'facebook' && { facebookId: socialId }),
            ...(type === 'google' && { googleId: socialId }),
          },
        ],
        email: toLower(email),
      },
    })) as unknown as IUserDocument;
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserByProp = async (prop: string, type: string) => {
  try {
    const user = (await UserModel.findOne({
      raw: true,
      where: {
        ...(type === 'username' && { username: upperFirst(prop) }),
        ...(type === 'email' && { email: toLower(prop) }),
      },
    })) as unknown as IUserDocument;
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

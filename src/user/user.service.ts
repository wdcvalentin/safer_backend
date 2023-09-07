import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import fetch from 'node-fetch';
import { UserDetails, userDataState } from './user-details.interface';
import { UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  _getUserDetails(user: UserDocument): UserDetails {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      contacts: user?.contacts,
    };
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDetails | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;

    return this._getUserDetails(user);
  }

  async findUserById(id: string): Promise<UserDocument> {
    return await this.userModel.findById(id).exec();
  }

  async create(
    name: string,
    email: string,
    hashedPassword: string,
    contacts: string[],
  ): Promise<UserDocument> {
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
      contacts,
    });
    return newUser.save();
  }

  async update(
    id: string,
    user: UserDocument,
    state = '$addToSet',
  ): Promise<any> {
    console.log('[update]:', user);
    const { contacts, ...fieldsToUpdate } = user;
    const updateData = {
      ...fieldsToUpdate,
      [state]:
        state === '$pull'
          ? { contacts: { email: { $in: contacts } } }
          : { contacts: { $each: contacts } },
    };
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async alertUserContacts(userData: UserDetails): Promise<string> {
    console.log(
      `[alertUserContacts]: sending an alert notification to ${String(
        userData.contacts,
      )}`,
    );

    try {
      const response: any = await fetch(
        `${process.env.AWS_API_NOTIFICATION}/alert`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: userData,
          }),
        },
      );
      return response.statusText;
    } catch (error) {
      console.log(`error while alerting contacts of id ${userData.id}`, error);
    }
  }

  async alertState(userData: userDataState): Promise<string> {
    console.log(
      `[alertState]: sending an alert state confirmation ${
        userData.contacts && `to ${String(userData.contacts)}`
      }`,
    );

    try {
      const response: any = await fetch(
        `${process.env.AWS_API_NOTIFICATION}/alert`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: userData,
          }),
        },
      );
      return response;
    } catch (error) {
      console.log(`error while alerting contacts of id ${userData.id}`, error);
    }
  }
}

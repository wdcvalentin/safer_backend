import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import {
  subscribeContactsToTopic,
  unSubscribeContactsToTopic,
} from 'src/utils/subscription';
import { UserDetails, userDataState } from './user-details.interface';
import { UserDocument } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get(':id')
  getUser(@Param('id') id: string): Promise<UserDetails | null> {
    return this.userService.findById(id);
  }

  @UseGuards(JwtGuard)
  @Post('update/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData,
  ): Promise<UserDocument> {
    try {
      return this.userService.update(id, userData);
    } catch (error) {
      console.log('error', error);
    }
  }

  @UseGuards(JwtGuard)
  @Post('alert')
  alertUserContact(@Body() userData: UserDetails): Promise<string> {
    return this.userService.alertUserContacts(userData);
  }

  @UseGuards(JwtGuard)
  @Post('alert/state')
  stateAlert(@Body() userData: userDataState): Promise<string> {
    return this.userService.alertState(userData);
  }

  @UseGuards(JwtGuard)
  @Post('subscription/:id')
  async subscribeUserContact(
    @Param('id') id: string,
    @Body() userData,
  ): Promise<{ contacts: string[] }> {
    const { contacts } = userData;
    const emails = contacts.map((c): any => c.email);
    try {
      const [updatedUser, subscribeTopic] = await Promise.all([
        this.userService.update(id, userData, '$addToSet'),
        subscribeContactsToTopic(emails),
      ]);
      console.log('subscribeTopic', subscribeTopic);

      return {
        contacts: updatedUser.contacts,
      };
    } catch (error) {
      console.log('error', error);
    }
  }

  @UseGuards(JwtGuard)
  @Delete('subscription/:id')
  async unSubscribeUserContact(
    @Param('id') id: string,
    @Body() userData,
  ): Promise<{ contacts: string[] }> {
    console.log('[unSubscribeUserContact]: handler start');
    const { contacts } = userData;
    try {
      const subscribeTopic = await unSubscribeContactsToTopic(contacts);
      if (subscribeTopic === 'Forbidden') {
        throw new Error('[unSubscribeUserContact]: subscribeTopic');
      }
      const updatedUser = await this.userService.update(id, userData, '$pull');

      return {
        contacts: updatedUser.contacts,
      };
    } catch (error) {
      throw new Error(`[unSubscribeUserContact]: ${error}`);
    }
  }
}

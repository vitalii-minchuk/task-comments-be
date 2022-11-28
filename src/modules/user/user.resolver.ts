import { Query } from 'type-graphql';
import { User } from './user.dto';

class UserResolver {
  @Query(() => User)
  user() {
    return {
      id: '345656',
      username: 'dfsfsf',
    };
  }
}

export default UserResolver;

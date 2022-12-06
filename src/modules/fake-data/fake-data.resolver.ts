import { Authorized, Mutation } from 'type-graphql';
import _times from 'lodash.times';

import { enqueue } from './../../utils/queue';
import { removeData } from './fake-data.service';

class FakeDataResolver {
  
  @Authorized()
  @Mutation(() => Boolean)
  async generateFakeData() {
    try {
      await Promise.all(
        _times(10).map(async () => {
          await enqueue('generateFakeUser');
        }),
      );

      await Promise.all(
        _times(30).map(async () => {
          await enqueue('generateFakePost');
        }),
      );

      await Promise.all(
        _times(20).map(async () => {
          await enqueue('generateFakeComments');
        }),
      );

      return true;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return false;
    }
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deleteData() {
    try {
      await removeData();

      return true;
    } catch (error) {
      return false;
    }
  }
}
export default FakeDataResolver;

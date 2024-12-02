
import * as userCronJobsServices from './services';

export default {
    /**  Update user Subcription status  based on renewal date. 
     * and subscription start date.
      this function do this operations based on all users */

    async updateUserPremiumSubscriptionStatus(strapi) {
        // Fetching all users bsed on condtions we user on fliter section
        const users: User[] = await userCronJobsServices.default.fetchAllUserPremiumSubscriptionActive(strapi);

        if (users.length > 0) {
            for (const user of users) {
                const sanitizedUser = await sanitizeUser(user, {});
                strapi.log.info(`sanitizedUser CronJob line=16/usersCronJob ${sanitizedUser}`,);

                await userCronJobsServices.default.updateUserSubscriptionStatus(user);
            }
        }
    },

    async updateUserFreeSubscriptionStatus(strapi){
          // Fetching all users bsed on condtions we user on fliter section
          const users: User[] = await userCronJobsServices.default.fetchAllUserFreeSubscriptionTrialing(strapi);

          if (users.length > 0) {
              for (const user of users) {
                  const sanitizedUser = await sanitizeUser(user, {});
                  strapi.log.info(`sanitizedUser CronJob line=30/usersCronJob ${sanitizedUser}`,);
  
                  await userCronJobsServices.default.updateUserSubscriptionStatus(user);
              }
          }
    }
}


async function sanitizeUser(query, ctx) {
    const schema = strapi.getModel("plugin::users-permissions.user");
    // const { auth } = ctx.state;

    return strapi.contentAPI.sanitize.output(query, schema);
}


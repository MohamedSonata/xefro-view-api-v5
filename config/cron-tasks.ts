import * as userCronJobs from '../src/cron-jobs/user/user-cron-jobs';
 var updateUserSubscriptionStatusexecutionCount =0;

export default {

    updateUserSubscriptionStatus: {
      task: async({ strapi }) => {
        updateUserSubscriptionStatusexecutionCount++;
       await userCronJobs.default.updateUserPremiumSubscriptionStatus(strapi);

       await userCronJobs.default.updateUserFreeSubscriptionStatus(strapi);
       
      },
      options: {

        // this will run every new day and 1 minute after midnight.
        rule:'1 0 * * *',

        // this if we need it run every mint
        // rule: "*/1 * * * *",
      },
    },
  };

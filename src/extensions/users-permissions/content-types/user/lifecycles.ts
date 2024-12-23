import payment from "../../../../api/payment/controllers/payment";

export default {
  async beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    // Modifying Email if it's recived as phone number to be phoneNum plus Alter domain name
    // Veryfing Email Structure
    event.params.data.email = await modifyEmail(event.params.data.email);
  },

  async afterCreate(event, strapi) {
    const { result, params } = event;

    const subscription = await defaultUserSubscriptionComponent();
    try {
      process.nextTick(async () => {
        // Fetcing Plan which meet requirements Filters 
        const freePlans = await strapi.documents('api::plan.plan').findMany({
          filters: {
            planTitle: "Free"
          }
        });
        // Update User Subscription And plan to Default Values on New User Create
        await strapi.documents('plugin::users-permissions.user').update({
          documentId: result.documentId,
          data: {
            subscription: subscription,
            plan: {
              connect: [freePlans[0].documentId.toString()]
            }
          },
        });
      });
    } catch (error) {
      strapi.log.warn(error);
    }

    // do something to the result;
  },
};
async function defaultUserSubscriptionComponent() {
  const now = new Date();

  const trialEndDate = new Date(now);
  trialEndDate.setDate(trialEndDate.getDate() + 7);


  const gracePeriodEndDate = new Date(now); // Start from 'now' again
  gracePeriodEndDate.setDate(gracePeriodEndDate.getDate() + 10); // Or however many days you need

  const updatedSubscription = {
    subscriptionStatus: "trialing",
    trialEndDate: trialEndDate.toISOString(),
    gracePeriodEndDate: gracePeriodEndDate.toISOString(),
    autoRenew: false,
    startDate: now,
    endDate: trialEndDate.toISOString(),
    renewalDate: trialEndDate.toISOString(),
    cancellationReason: "",
    subscribedUpdateAt: now,
    subscribedAt: now,
  }
  return updatedSubscription;
}
async function modifyEmail(email) {
  // Check if the email contains only numbers
  if (/^\d+$/.test(email)) {
    // If it contains only numbers, concatenate with "phoneNumAlterDomain()"
    return email + "@xefro.net";
  } else {
    // If not, return the original email
    return email;
  }
}
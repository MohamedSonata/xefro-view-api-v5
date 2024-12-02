import payment from "../../../../api/payment/controllers/payment";

export default {
  async beforeCreate(event) {
    console.log("BeforeCreate Running");
    console.log("BeforeCreate Running>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>BeforeCreate Running");
    const { data, where, select, populate } = event.params;
    event.params.data.email = await modifyEmail(event.params.data.email);

    event.params.data.plan = "1";

    console.log(event.params.data);
    // let's do a 20% discount everytime
    //   event.params.data.price = event.params.data.price * 0.8;
  },

  async afterCreate(event, strapi) {
    const { result, params } = event;

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


    }
    
    try {
      // event.params.data.subscription = updatedSubscription;
      // await strapi.plugin('users-permissions').service("user").edit(result.id, {
      //   subscription:{...updatedSubscription}
      // });
      process.nextTick(async () => {
        const userAfterEdited = await strapi.documents('plugin::users-permissions.user').update({
          documentId: result.documentId,
          data: { subscription: updatedSubscription },
          populate: {
            subscription: true
          }
        });
      });


    } catch (error) {
      console.log(error);
    }

    // do something to the result;
  },
};
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


export default {

    /** Fetching all users bsed on condtions we user on fliter section */
    async fetchAllUserPremiumSubscriptionActive(strapi) {
        const currentDatetime = new Date().toISOString();
        try {
            const users: User[] = await strapi.service("plugin::users-permissions.user").fetchAll({
                populate: {
                    subscription: {
                        populate: {
                            payment: true
                        }
                    }, // Ensure `subscription` relation is populated
                },
                // Filter User Subscription based on subscription not null and status is "Active" and renewalDate is lessthan dateTime (now)
                filters: {
                    subscription: {
                        renewalDate: {
                            $lt: currentDatetime
                        },
                        subscriptionStatus: {
                            $eq: "active"
                        },
                        id: {
                            $notNull: true,
                        }
                    },
                }
            });

            return users;
        } catch (error) {
            strapi.log.info("This Error happen in (cron jobs/ user / services.ts L=35 ", error)

        }


    },
        /** Fetching all users bsed on condtions we user on fliter section */
        async fetchAllUserFreeSubscriptionTrialing(strapi) {
            const currentDatetime = new Date().toISOString();
            try {
                const users: User[] = await strapi.service("plugin::users-permissions.user").fetchAll({
                    populate: {
                        subscription: true, // Ensure `subscription` relation is populated
                    },
                    // Filter User Subscription based on subscription not null and status is "trialing" and trialEndDate is lessthan dateTime (now)
                    filters: {
                        subscription: {
                            trialEndDate: {
                                $lt: currentDatetime
                            },
                            subscriptionStatus: {
                                $eq: "trialing"
                            },
                            id: {
                                $notNull: true,
                            }
                        },
                    }
                });
    
                return users;
            } catch (error) {
                strapi.log.info("This Error happen in (cron jobs/ user / services.ts L=67", error)
    
            }
    
    
        },
    async updateUserSubscriptionStatus(user: User,) {
        try {
            const updatedSubscription: Subscription = {
                id: user.subscription.id,

                subscriptionStatus: 'expired',
                startDate: user.subscription.startDate,
                endDate: user.subscription.endDate,
                renewalDate: user.subscription.renewalDate,
                cancellationReason: user.subscription.cancellationReason,
                subscribedUpdateAt: user.subscription.subscribedUpdateAt,
                subscribedAt: user.subscription.subscribedAt,
                trialEndDate: user.subscription.trialEndDate,
                gracePeriodEndDate: user.subscription.gracePeriodEndDate,
                autoRenew: user.subscription.autoRenew,
                payment: user.subscription.payment,
            }
            const subMap = subscriptionToMap(updatedSubscription);


            const userAfterEdited = await strapi.documents('plugin::users-permissions.user').update({
                documentId: user.documentId,
                data: { subscription: subMap },
                populate: {
                    subscription: true
                }
            });
            return userAfterEdited;
        } catch (error) {
            strapi.log.info(`Error Occurred while update user subscription status services.ts L=106 ${error}`);
        }

    }
}
function subscriptionToMap(sub: Subscription): Record<string, any> {
    return { ...sub };  // Using the spread operator is the simplest way
}

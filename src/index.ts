import type { Core } from '@strapi/strapi';
import  lifeCycles from './extensions/users-permissions/content-types/user';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap( { strapi }: { strapi: Core.Strapi } ) {
   
         // generic subscribe for generic handling
         strapi.db.lifecycles.subscribe({
          models: ['plugin::users-permissions.user'],
           
          // afterCreate lifeCycle
          async afterCreate(event) {
            lifeCycles.lifecycles.afterCreate(event,strapi);
            console.log("userAfterCreateExcuted");
          },

          // beforeCreate LifeCycle
          async beforeCreate(event) {
            // event.params.data.email =  event.params.data.email +"@xefro.com"
            lifeCycles.lifecycles.beforeCreate(event);
            console.log("userBeforeCreateExcuted");

            // beforeCreate lifeclcyle
          },
        });
  },
};

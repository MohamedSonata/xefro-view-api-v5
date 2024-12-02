

// export default serviceA;
import type { Core } from '@strapi/strapi';
import  * as utils from '../utils';
import  strapiUtils  from '@strapi/utils';
import * as lodash from 'lodash';
import { PluginUsersPermissionsUser } from '../../../../../types/generated/contentTypes';
import userPlugin from '@strapi/plugin-users-permissions/server/services/user';
import userUtils from '../utils/user';

const serviceA = ({ strapi }: { strapi: Core.Strapi }) => {
  // Initialize `userPluginServices` once
  // const userPluginServices = strapi.plugin('users-permissions').service('user');

  return {
    async getWelcomeMessage() {
      // Use `userPluginServices` directly in this function
      const res = await  strapi.plugin('users-permissions').service('user').fetchAll({
      populate:"*"
      });
      console.log(res);
    //   const res = await  strapi.plugin('users-permissions').controller("user").f({
    //     where:{
    //         subscription:{
    //           subscriptionStatus:"active"
    //         }
    //     }
    // });
  
    // console.log("activeactive",res);
    },

    async anotherFunction() {
      // Reuse `userPluginServices` here
     
      const userCount =  await strapi.service("plugin::users-permissions.user").fetchAll({
       populate:"*"
      });;
      console.log(userCount);
      return userCount;
    },

    async  sendOTPMessage(ctx) {
      let { phoneNumber } = ctx.request.body;
         
    
      let userVerficationData;
    
      // TODO: Excute SEND SMSVEND Message first and check if it's send  then callback return ctx.send
      //  From Services File Functions
    
      userVerficationData = await utils.default.userUtils({strapi}).verificationCode(phoneNumber);
    
      return ctx.send({
        data: {
          otpMessage: userVerficationData,
        },
      });
    },
    async  forgotPasswordByPhoneNumber(ctx) {
      let { phoneNumber } = ctx.request.body;
      console.log(phoneNumber);
      console.log(ctx.state.auth);
      //let { phoneNumber } = ctx.params;
      let userVerficationData: { verficationCode: any; indentifier?: any; startAt?: Date; endAt?: string; };
    
      const store = strapi.store({ type: "plugin", name: "users-permissions" });
    
      phoneNumber = await utils.default.userUtils({strapi}).modifyEmail(phoneNumber);
    
       await utils.default.userUtils({strapi}).validateQuery(ctx.query, ctx);
    
      const sanitizedQuery = await utils.default.userUtils({strapi}).sanitizeQuery(ctx.query, ctx);
    
      const user = await strapi.query("plugin::users-permissions.user").findOne({
        where: { email: phoneNumber.toLowerCase() },
      });
    
   
      let data = await strapi.plugin('users-permissions').service('user').fetch(1, sanitizedQuery);
      console.log("DataVariable",data);
    
      if (!user) {
        if (phoneNumber.includes(utils.default.userUtils({strapi}).phoneNumAlterDomain())) {
          const emailParts = phoneNumber.split(utils.default.userUtils({strapi}).phoneNumAlterDomain());
          throw new strapiUtils.errors.ValidationError(
            `Make sure you enter your identifier Correct, not Found ${emailParts[0]}`
          );
        } else {
          throw new strapiUtils.errors.ValidationError(
            `Make sure you enter your identifier Correct, not Found ${phoneNumber}`
          );
        }
      }
    
      if (!user.password) {
        throw new strapiUtils.errors.ValidationError("Invalid identifier or password");
      }
    
      // const validPassword = await getService('user').validatePassword(
      //  ctx. params.password,
      //   user.password
      // );
    
      // if (!validPassword) {
      //   throw new ValidationError('Invalid identifier or password');
      // }
    
      const advancedSettings = await store.get({ key: "advanced" });
    
      const requiresConfirmation = lodash.get(advancedSettings, "email_confirmation");
    
      if (requiresConfirmation && user.confirmed !== true) {
        throw new strapiUtils.errors.ApplicationError("Your account email is not confirmed");
      }
    
      if (user.blocked === true) {
        throw new strapiUtils.errors.ApplicationError(
          "Your account has been blocked by an administrator"
        );
      }
    
      const sanitizedUser = await utils.default.userUtils({strapi}).sanitizeUser(user, ctx);
    
      // Sending Phone Message with Code if the phone number is related to user  in the database
      if (user) {
        userVerficationData = await utils.default.userUtils({strapi}). verificationCode(phoneNumber);
        const resetPasswordToken = userVerficationData.verficationCode;
        //console.log(resetPasswordToken);
        await strapi.plugin('users-permissions').service("user").edit(user.id, { resetPasswordToken });
      }
    
      // TODO: Define SMSVend Sending PhoneNumber Message From Services File Functions
      /// This wait until verify smsvend service to active
    
      // if (user) {
      //   if (
      //     await sendPhoneNumberMessage(
      //       phoneNumber,
      //       messageSchema(userVerficationData.verficationCode)
      //     )
      //   ) {
      //     console.log("user verified SMSVendSent");
      //   } else {
      // return ctx.badRequest("Something went wrong, please try again",{ status:false,
      //   phoneNumber: phoneNumber },400);
      //     );
      //   }
      // } else {
      //   throw new ApplicationError("UserNotfount");
      // }
    
      return ctx.send({
        data: {
          user: sanitizedUser,
          forgotPassword: userVerficationData,
          fff: ctx.state.auth,
        },
      });
    },
    async registerByEmailAndPhoneNumber(ctx, next) {
      ctx.request.body.email = await userUtils({strapi}).modifyEmail(ctx.request.body.email);
      return await strapi.plugin('users-permissions').controller('auth').register(ctx, next);
    }, 
    
    async callback(ctx, next) {
      ctx.request.body.identifier = await userUtils({strapi}).modifyEmail(ctx.request.body.identifier);
      console.log(" ctx.request.body.identifier", ctx.request.body.identifier);
    
      return await strapi.plugin('users-permissions').controller('auth').callback(ctx, next);
    },
      async forgotPassword(ctx, next) {
      ctx.request.body.identifier = await userUtils({strapi}).modifyEmail(ctx.request.body.identifier);
      console.log(" ctx.request.body.identifier", ctx.request.body.identifier);
     
      return await strapi.plugin('users-permissions').controller('auth').fogotPassword(ctx, next);
    },



  };
};

export default serviceA;

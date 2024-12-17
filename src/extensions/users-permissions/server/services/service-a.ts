

// export default serviceA;
import type { Core } from '@strapi/strapi';
import * as utils from '../utils';
import strapiUtils from '@strapi/utils';
import geoip from 'fast-geoip';
import * as lodash from 'lodash';
// import { PluginUsersPermissionsUser } from '../../../../../types/generated/contentTypes';
// import userPlugin from '@strapi/plugin-users-permissions/server/services/user';
import userUtils from '../utils/user';
import getDateTimeInfo from '../../../../core/utils/get-world-datetime';
import { isParenthesizedTypeNode } from 'typescript';

const serviceA = ({ strapi }: { strapi: Core.Strapi }) => {


  return {
    // This Refrence of how to use plugin services


    // const res = await  strapi.plugin('users-permissions').service('user').fetchAll({
    //   populate:"*"
    //   });
    // const userCount =  await strapi.service("plugin::users-permissions.user").fetchAll({
    //   populate:"*"
    //  });;


    async sendOTPMessage(ctx) {
      let { phoneNumber } = ctx.request.body;
      console.log(ctx.request.headers);
      console.log(ctx.request.headers['x-forwarded-for'] );


      let userVerficationData;

      // TODO: Excute SEND SMSVEND Message first and check if it's send  then callback return ctx.send
      //  From Services File Functions

      userVerficationData = await utils.default.userUtils({ strapi }).verificationCode(phoneNumber);

      return ctx.send({
        data: {
          otpMessage: userVerficationData,
        },
      });
    },
    async getRealWorldDateTimeByTimeZone(ctx){
      // let { timezone,ip } = ctx.request.body;
      const testIp = "176.29.59.60";
const geo = await geoip.lookup(testIp);

console.log(geo);
const ip = ctx.request.headers['x-forwarded-for'] || ctx.request.connection.remoteAddress;
      console.log("publicIp",ip);
      console.log("headers",ctx.request.headers);
      await getDateTimeInfo("Asia/Amman",ip);
    },
    async forgotPasswordByPhoneNumber(ctx) {
      let { phoneNumber } = ctx.request.body;


      let userVerficationData: { verficationCode: any; indentifier?: any; startAt?: Date; endAt?: string; };

      const store = strapi.store({ type: "plugin", name: "users-permissions" });

      phoneNumber = await utils.default.userUtils({ strapi }).modifyEmail(phoneNumber);

      await utils.default.userUtils({ strapi }).validateQuery(ctx.query, ctx);

      const sanitizedQuery = await utils.default.userUtils({ strapi }).sanitizeQuery(ctx.query, ctx);

      const user = await strapi.query("plugin::users-permissions.user").findOne({
        where: { email: phoneNumber.toLowerCase() },
      });


      let data = await strapi.plugin('users-permissions').service('user').fetch(1, sanitizedQuery);

      if (!user) {
        if (phoneNumber.includes(utils.default.userUtils({ strapi }).phoneNumAlterDomain())) {
          const emailParts = phoneNumber.split(utils.default.userUtils({ strapi }).phoneNumAlterDomain());
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

      const validPassword = await strapi.plugin('users-permissions').service('user').validatePassword(
        ctx.params.password,
        user.password
      );

      if (!validPassword) {
        throw new strapiUtils.errors.ValidationError('Invalid identifier or password');
      }

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

      const sanitizedUser = await utils.default.userUtils({ strapi }).sanitizeUser(user, ctx);

      // Sending Phone Message with Code if the phone number is related to user  in the database
      if (user) {
        userVerficationData = await utils.default.userUtils({ strapi }).verificationCode(phoneNumber);
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
      ctx.request.body.email = await userUtils({ strapi }).modifyEmail(ctx.request.body.email);
      return await strapi.plugin('users-permissions').controller('auth').register(ctx, next);
    },

    async callback(ctx, next) {
      ctx.request.body.identifier = await userUtils({ strapi }).modifyEmail(ctx.request.body.identifier);

      return await strapi.plugin('users-permissions').controller('auth').callback(ctx, next);
    },
    async forgotPassword(ctx, next) {
      ctx.request.body.identifier = await userUtils({ strapi }).modifyEmail(ctx.request.body.identifier);

      return await strapi.plugin('users-permissions').controller('auth').fogotPassword(ctx, next);
    },

    async updateUserBySpecificFieldKey(ctx) {
      
     
     
      var userAfterEdited;
      // Function to check if all required fields are present in the request body
      const hasAllRequiredFields = (body) => {
        return body.lastDeviceUsed != null && body.subscription != null && body.billingAddress != null;
      };

      try {
        if (hasAllRequiredFields(ctx.request.body)) {
          userAfterEdited = await strapi.documents('plugin::users-permissions.user').update({
            documentId: ctx.params.id,
            
            data: {

              lastDeviceUsed: ctx.request.body.lastDeviceUsed,
              subscription: ctx.request.body.subscription,
              billingAddress: ctx.request.body.billingAddress,
            },
            ...ctx.request.query
          });
          const sanitizedUser = await utils.default.userUtils({ strapi }).sanitizeUser(userAfterEdited, ctx);

          return ctx.send(sanitizedUser);
        }
        if (ctx.request.body.lastDeviceUsed != null) {
          userAfterEdited = await strapi.documents('plugin::users-permissions.user').update({
            documentId: ctx.params.id,
            data: {

              lastDeviceUsed: ctx.request.body.lastDeviceUsed,

            },
            ...ctx.request.query
          });
        } else if (ctx.request.body.subscription != null) {
          userAfterEdited = await strapi.documents('plugin::users-permissions.user').update({
            documentId: ctx.params.id,
            data: {
              subscription: ctx.request.body.subscription,

            },
            ...ctx.request.query
          });
        } else if (ctx.request.body.billingAddress != null) {
          userAfterEdited = await strapi.documents('plugin::users-permissions.user').update({
            documentId: ctx.params.id,
            data: {
              billingAddress: ctx.request.body.billingAddress,
            },
            ...ctx.request.query
          });
        } else {
          strapi.log.info(" Not able to update and thing by you key defined");
        }

        const sanitizedUser = await utils.default.userUtils({ strapi }).sanitizeUser(userAfterEdited, ctx);

        return ctx.send(sanitizedUser);
      }
      catch (e) {
        strapi.log.info(" Not able to update and thing by you key defined (user-Services.ts)L237");

      }
    }
  };
};

export default serviceA;

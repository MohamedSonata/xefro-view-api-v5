

// export default serviceA;
import type { Core } from '@strapi/strapi';
import * as utils from '../utils';
import strapiUtils from '@strapi/utils';
import geoip from 'fast-geoip';
import * as lodash from 'lodash';


import userUtils from '../utils/user';
import getDateTimeInfo from '../../../../core/utils/get-world-datetime';
import { isParenthesizedTypeNode } from 'typescript';
import { Context } from 'koa';

const serviceA = ({ strapi }: { strapi: Core.Strapi }) => {


  return {
    // This Refrence of how to use plugin services


    // const res = await  strapi.plugin('users-permissions').service('user').fetchAll({
    //   populate:"*"
    //   });
    // const userCount =  await strapi.service("plugin::users-permissions.user").fetchAll({
    //   populate:"*"
    //  });;


    async forgotPassword(ctx) {

      const { email } = await utils.default.userUtils({ strapi }).validateForgotPasswordBody(ctx.request.body);

      // Find the user by email.
      const user = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({ where: { email: ctx.request.body.email.toLowerCase() } });

      if (!user || user.blocked) {
        throw new strapiUtils.errors.ValidationError('User not found, or maybe user blocked, check your email again');
      }

      const sanitizedUser = await utils.default.userUtils({ strapi }).sanitizeUser(user, ctx);

      let userVerficationData: { verficationCode: String; indentifier?: String; startAt?: Date; endAt?: string; };
      // Sending Phone Message with Code if the phone number is related to user  in the database
      if (user) {
        userVerficationData = await utils.default.userUtils({ strapi }).verificationCode(email);
        const resetPasswordToken = userVerficationData.verficationCode;
        //  NOTE: Update the user before sending the email so an Admin can generate the link if the email fails
        await strapi.plugin('users-permissions').service("user").edit(user.id, { resetPasswordToken });
      }
      const resetPasswordToken = userVerficationData.verficationCode;

      const emailToSend = {
        to: user.email,
        from: "noreply@xefro.net",
        replyTo: "",
        subject: "Resset Password",
        text: `<p>We heard that you lost your password. Sorry about that!</p>`,
        html: utils.default.userUtils({ strapi }).customEmailTemplate(resetPasswordToken, user.username),
      };
      

      // await strapi.plugin('email').service('email').send(emailToSend);

      return ctx.send({
        data: {
          user: sanitizedUser,
          forgotPassword: userVerficationData,
        },
      });
    },
    async sendVerficationEmail(ctx:Context,verficationData?
      :VerficationData
    ){
      const {identifier,userName}=ctx.request.body;
      let userVerficationData: { verficationCode: String; indentifier?: String; startAt?: Date; endAt?: string; };
      // Sending Phone Message with Code if the phone number is related to user  in the database
      if (identifier) {
        userVerficationData =  verficationData?? await utils.default.userUtils({strapi}).verificationCode(identifier);
        const confirmationToken = userVerficationData.verficationCode;

        const emailToSend = {
          to: identifier,
          from: "noreply@xefro.net",
          replyTo: "",
          subject: "Confirmation OTP",
          text: `<p>We noticed you need an confirmation Token!</p>`,
          html: utils.default.userUtils({ strapi }).customConfirmationEmailTemplate(confirmationToken, userName??identifier),
        };
        // await strapi.plugin('email').service('email').send(emailToSend);
        return ctx.send({
          verficationData: userVerficationData,
      });
      }
    
      throw new strapiUtils.errors.ValidationError(`identifer not found in the request body Check your body request again, [${Object.keys(ctx.request.body)} ]`);
     
    },

    //TODO: NOT USED
    async sendOTPMessage(ctx) {
      let { identifier } = ctx.request.body;

      let userVerficationData;

      // TODO: Excute SEND SMSVEND Message first and check if it's send  then callback return ctx.send
      //  From Services File Functions

      userVerficationData = await utils.default.userUtils({ strapi }).verificationCode(identifier);

      return ctx.send({
        data: {
          otpMessage: userVerficationData,
        },
      });
    },

    async getRealWorldDateTimeByTimeZone(ctx) {
      let { ip } = ctx.request;

      const geo = await geoip.lookup(ctx.request.ip);

      const dateTimeInfoByTimeZoneAndIP = await getDateTimeInfo(geo.timezone, ctx.request.ip);

      return ctx.send({
        getTimeInfo: dateTimeInfoByTimeZoneAndIP,
        ip: ctx.request.ip,
        geo: geo
      });
    },
    //TODO: NOT USED
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
      //   
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
     //TODO: NOT USED
    async registerByEmailAndPhoneNumber(ctx, next) {
      ctx.request.body.email = await userUtils({ strapi }).modifyEmail(ctx.request.body.email);
      return await strapi.plugin('users-permissions').controller('auth').register(ctx, next);
    },
     //TODO: NOT USED
    async callback(ctx, next) {
      ctx.request.body.identifier = await userUtils({ strapi }).modifyEmail(ctx.request.body.identifier);

      return await strapi.plugin('users-permissions').controller('auth').callback(ctx, next);
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
          userAfterEdited = await strapi.documents('plugin::users-permissions.user').update({
            documentId: ctx.params.id,
            data: ctx.request.body,
            ...ctx.request.query
          });

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
type VerficationData =  {
  indentifier: String,
  verficationCode: String,
  startAt: Date,
  endAt: string,
}
export default serviceA;

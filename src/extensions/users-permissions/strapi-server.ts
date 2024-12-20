

// import controllerA from "./server/controllers";
import * as services from "./server/services/index";
// import lifecycles from './content-types/user/lifecycles';
// import { Context, Next } from "koa";
export default async (plugin,  ) => {

 // Get Real World DateTime based on time zone 
  plugin.controllers.user.getRealWorldDateTimeByTimeZone = async (ctx) => {
    return await services.default.serviceA( {strapi} ).getRealWorldDateTimeByTimeZone(ctx);
  };


  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/user/timezone/time",
    handler: "user.getRealWorldDateTimeByTimeZone",
    config: {
      prefix: "",
    },
  });
  plugin.controllers.user.sendVerficationEmail = async (ctx) => {
    return await services.default.serviceA( {strapi} ).sendVerficationEmail(ctx);
  };


  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/user/send-otp",
    handler: "user.sendVerficationEmail",
    config: {
      prefix: "",
    },
  });

    // Custom User update Components until they fixinx the error while update components as v4
    plugin.controllers.user.updateUserBySpecificFieldKey = async (ctx,next) => {
      
     
     

      return await services.default.serviceA( {strapi} ).updateUserBySpecificFieldKey(ctx);
    };
    plugin.routes["content-api"].routes.push({
      method: "PUT",
      path: "/user/update/field-by-key/:id",
      handler: "user.updateUserBySpecificFieldKey",
      config: {
        prefix: "",
      },
    });



  plugin.controllers.user.forgotPassword = async (ctx, next) => {
    return await services.default.serviceA( {strapi} ).forgotPassword(ctx);
  };;

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/user/auth/forgot-password", // this path for Auth section register Endpoint
    handler: "user.forgotPassword", // Use the correct handler reference based on controller used
    config: {
      prefix: "",
    },
  });
     //TODO: NOT USED 
  // Forgot Password by PhoneNumber Route And Controller Methods
  // plugin.controllers.user.forgotPasswordByPhoneNumber = async (ctx) => {

  //   return await services.default.serviceA( {strapi} ).forgotPasswordByPhoneNumber(ctx);
  // };
  // plugin.routes["content-api"].routes.push({
  //   method: "POST",
  //   path: "/user/auth/forgot-phone-password",
  //   handler: "user.forgotPasswordByPhoneNumber",
  //   config: {
  //     prefix: "",
  //   },
  // });

 
//TODO: NOT USED
  // plugin.controllers.user.registerByEmailAndPhoneNumber = async (ctx, next) => {



  //   return await services.default.serviceA( {strapi} ).registerByEmailAndPhoneNumber(ctx, next);
  // };
  // // Configure the route for creating a user
  // plugin.routes["content-api"].routes.push({
  //   method: "POST",
  //   path: "/user/auth/local/register", // this path for Auth section register Endpoint
  //   handler: "user.registerByEmailAndPhoneNumber", // Use the correct handler reference based on controller 
  //   config: {
  //     prefix: "",
  //   },
  // });


//TODO: NOT USED
  // plugin.controllers.user.callback = async (ctx, next) => {

  //   return await services.default.serviceA( {strapi} ).callback(ctx, next);
  // };

  // plugin.routes["content-api"].routes.push({
  //   method: "POST",
  //   path: "/user/auth/local", // this path for Auth section register Endpoint
  //   handler: "user.callback", // Use the correct handler reference based on controller used
  //   config: {
  //     prefix: "",
  //   },
  // });

  return plugin;
};
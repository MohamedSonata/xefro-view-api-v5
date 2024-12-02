

import controllerA from "./server/controllers";
import  * as services from "./server/services/index";
import lifecycles from './content-types/user/lifecycles';
import { Context, Next } from "koa";
import type { Core } from '@strapi/strapi';
export default async(plugin) => {
    console.log("Server Loading >>>>>>>>>>>>>>>>>>>");
    // console.log("Server Loading >>>>>>>>>>>>>>>>>>>",plugin.controllers.auth.toString());

    console.log( plugin.contentTypes.user);
    
     plugin.controllers.user.sendOTPMessage = async (ctx)=>{
      console.log(" sendOTPMessage Function Called :D");
   return await services.default.serviceA({strapi}).sendOTPMessage(ctx);
     };


    plugin.routes["content-api"].routes.push({
      method: "POST",
      path: "/user/auth/otp-message",
      handler: "user.sendOTPMessage",
      config: {
        prefix: "",
      },
    });
  // Forgot Password by PhoneNumber Route And Controller Methods
  plugin.controllers.user.forgotPasswordByPhoneNumber =  async (ctx)=>{
    console.log(" forgotPasswordByPhoneNumber Function Called :D");
      
    return await services.default.serviceA({strapi}).forgotPasswordByPhoneNumber(ctx);
      };
  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/user/auth/forgot-phone-password",
    handler: "user.forgotPasswordByPhoneNumber",
    config: {
      prefix: "",
    },
  });

  // plugin.controllers.auth.register = async(ctx: Context,next: Next)=>{
  //   ctx.request.body.email=  ctx.request.body.email +'@xefro.net';
  //   console.log(ctx.request.body.email);
    

  //   return await strapi.plugin('users-permissions').controller('auth').register(ctx,next);
  // };
  // plugin.routes["content-api"].routes.push({
  //   method: "POST",
  //   path: "/auth/local/register", // this path for Auth section register Endpoint
  //   handler: "auth.register", // Use the correct handler reference based on controller used
  //   config: {
  //     middlewares: [],
  //     prefix: '',
  //     auth: false, 
  //   },
  // });

  plugin.controllers.user.registerByEmailAndPhoneNumber = async (ctx,next)=>{
    console.log("registerByPhone Function Called :D");
    // console.log("RegisterServer",ctx.body.email);
      
    return await services.default.serviceA({strapi}).registerByEmailAndPhoneNumber(ctx,next);
      };
  // Configure the route for creating a user
  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/user/auth/local/register", // this path for Auth section register Endpoint
    handler: "user.registerByEmailAndPhoneNumber", // Use the correct handler reference based on controller 
    config: {
      prefix: "",
    },
  });



  plugin.controllers.user.forgotPassword = async (ctx,next)=>{
    console.log("forgotPassword Function Called :D ");
      return await services.default.serviceA({strapi}).forgotPassword(ctx,next);
    // return await services.default.serviceA({strapi}).registerByPhoneNumber(ctx,next);
      };;

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/user/auth/forgot-password", // this path for Auth section register Endpoint
    handler: "user.forgotPassword", // Use the correct handler reference based on controller used
    config: {
      prefix: "",
    },
  });

  plugin.controllers.user.callback = async (ctx,next)=>{
    console.log("callback Function Called :D");
    // console.log("RegisterServer",ctx.body.email);
      
    return await services.default.serviceA({strapi}).callback(ctx,next);
      };

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/user/auth/local", // this path for Auth section register Endpoint
    handler: "user.callback", // Use the correct handler reference based on controller used
    config: {
      prefix: "",
    },
  });
    return plugin;
  };
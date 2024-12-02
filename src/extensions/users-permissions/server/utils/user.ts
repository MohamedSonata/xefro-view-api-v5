
import type { Core } from '@strapi/strapi';


const userUtils = ({ strapi }: { strapi: Core.Strapi }) => {
    
 return { 
    async index(ctx) {
//    console.log("ControllerAAAAAA");
return {"Welcome ":"ssss"}
  },

  
  async  verificationCode(indentifier: any) {
   
    const code = await generateRandomNumberCode(6);
    console.log("?UserCode:${code",code);
    const currentTimestamp = new Date();
    const endTimer = new Date();
    endTimer.setMinutes(currentTimestamp.getMinutes() + 15);
    return {
      indentifier: indentifier,
      verficationCode: code,
      startAt: currentTimestamp,
      endAt: endTimer.toISOString(),
    };
  },
  async modifyEmail(email) {
    // Check if the email contains only numbers
    if (/^\d+$/.test(email)) {
      // If it contains only numbers, concatenate with "phoneNumAlterDomain()"
      return email + phoneNumAlterDomain();
    } else {
      // If not, return the original email
      return email;
    }
  },
  async phoneNumAlterDomain(){ return "@xefro.net"},
 async validateQuery  (query, ctx)  {
    const schema = strapi.getModel("plugin::users-permissions.user");
    const { auth } = ctx.state;
  
    return strapi.contentAPI.validate.query(query, schema, { auth });
  },

  
  async sanitizeQuery  (query, ctx)  {
    const schema = strapi.getModel("plugin::users-permissions.user");
    const { auth } = ctx.state;
  
    return strapi.contentAPI.sanitize.query(query, schema, { auth });
  }, 
  async sanitizeUser  (query, ctx)  {
    const schema = strapi.getModel("plugin::users-permissions.user");
    const { auth } = ctx.state;
  
    return strapi.contentAPI.sanitize.output(query, schema, { auth });
  },

};
function phoneNumAlterDomain(){ return "@xefro.net"};

async function generateRandomNumberCode(length: number) {
    let code = "";
  
    for (let i = 0; i < length; i++) {
      const randomDigit = Math.floor(Math.random() * 10); // Generate a random digit (0-9)
      code += randomDigit.toString();
    }
  
    return code;
  }
}
export default userUtils;

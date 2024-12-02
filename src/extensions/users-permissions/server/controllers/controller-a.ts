
import type { Core } from '@strapi/strapi';

const controllerA = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
//    console.log("ControllerAAAAAA");
return ctx.body({"Welcome ":"ssss"})
  },
});

export default controllerA;

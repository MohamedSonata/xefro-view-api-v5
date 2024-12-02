
export default  (ctx, config, { strapi }) => {
    if (ctx.state.user && ctx.state.user.isActive) {
      return true;
    }
  
    return false;
  };
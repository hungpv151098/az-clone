module.exports = {
  formatMessage: (errors, req) => {
    return errors.map(item => {
      const msg = req.t(item.msg);
      if (msg.includes(':attribute')) {
        return {
          message: msg.replace(':attribute', req.t('field.' + item.param)),
          field: item.param,
        };
      }
      return { message: msg, field: item.param };
    });
  },
};

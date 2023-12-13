const { Router } = require('express');
const { processAction, processMiddleware } = require('./libs/processor');
// const rateLimit = require('express-rate-limit');
const routes = require('./routers');
const checkUser = require('./middlewares/user.middleware');
const addDefaultPaginate = require('./middlewares/paginate.middleware');
const router = Router();
// const apiLimiter = rateLimit({
//   windowMs: 60 * 1000, // 1 minutes
//   max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

routes.forEach(route => {
  // const rateLimitMiddleware =
  //   isNaN(route.rateLimit?.window) || isNaN(route.rateLimit?.max)
  //     ? apiLimiter
  //     : rateLimit({
  //         windowMs: route.rateLimit.window,
  //         max: route.rateLimit.max,
  //         standardHeaders: true,
  //         legacyHeaders: false,
  //       });
  const paginateMiddleWare = route.isPaginate ? processMiddleware(addDefaultPaginate) : [];
  const validationMiddleware = route.validation ? route.validation : [];
  const userMiddleware = route.isAuthenticate ? processMiddleware(checkUser) : [];
  const multerMiddleware = route.multer ? route.multer : [];
  const afterCommit = route.needSqlTransaction ? route.afterCommit : null;
  const customerLogger = route.customLogger || null;
  router[(route.method || 'get').toLowerCase()](
    route.url,
    // rateLimitMiddleware,
    userMiddleware,
    paginateMiddleWare,
    validationMiddleware,
    multerMiddleware,
    route.disableProcessor
      ? route.action
      : processAction(route.action, !!route.needSqlTransaction, afterCommit, customerLogger, route.validation)
  );
});

module.exports = router;

const DB = require('../models/postgres');
const appMessages = require('../constants/appMessages');
const appCodes = require('../constants/appCodes');
const throwError = require('../libs/throwError');
const { BALANCE_TYPE } = require('../constants/const');
const { successResponse } = require('../utils/response');
const { findOneUser } = require('./user.service');
const Decimal = require('decimal.js');

const checkBalance = async (userId, totalCost) => {
  const user = await findOneUser({ where: { id: userId } });
  if (!user) {
    throwError({
      message: appMessages.userNotFound,
      status: 404,
      code: appCodes.notFound,
    });
  }
  let balance = user?.balance + user?.balanceLock;
  if (balance < totalCost) {
    throwError({
      message: appMessages.paymentRequired,
      code: appCodes.paymentRequired,
      status: 402,
    });
  }
  return successResponse(appMessages.userCanPay);
};

const processingTransaction = async (user, postId, totalCost, action, t) => {
  let balance = new Decimal(user?.balance).add(new Decimal(user?.balanceLock));
  if (balance < totalCost) {
    return throwError({
      message: appMessages.paymentRequired,
      code: appCodes.paymentRequired,
      status: 402,
    });
  }
  if (user?.balanceLock <= totalCost) {
    let cost = new Decimal(totalCost).sub(new Decimal(user?.balanceLock));
    await DB.models.users.update(
      {
        balanceLock: 0,
        balance: new Decimal(user?.balance).sub(cost),
      },
      {
        where: { id: user?.id },
        lock: true,
        transaction: t,
      }
    );
    await Promise.all([
      DB.models.postTradeHistories.create(
        {
          userId: user?.id,
          postId,
          type: BALANCE_TYPE.BALANCE_LOCK,
          action,
          balanceLock: user?.balanceLock,
          costLock: user?.balanceLock,
          balanceLockAfter: 0,
        },
        { transaction: t }
      ),
      DB.models.postTradeHistories.create(
        {
          userId: user?.id,
          postId,
          type: BALANCE_TYPE.BALANCE,
          action,
          balance: user?.balance,
          cost: cost,
          balanceAfter: new Decimal(user?.balance).sub(cost),
        },
        { transaction: t }
      ),
    ]);
    return;
  }
  await DB.models.users.update(
    {
      balanceLock: user?.balanceLock - totalCost,
    },
    {
      where: { id: user?.id },
      lock: true,
      transaction: t,
    }
  );
  await Promise.all([
    DB.models.postTradeHistories.create(
      {
        userId: user?.id,
        postId,
        type: BALANCE_TYPE.BALANCE_LOCK,
        action,
        balanceLock: user?.balanceLock,
        costLock: totalCost,
        balanceLockAfter: new Decimal(user?.balanceLock).sub(totalCost),
      },
      { transaction: t }
    ),
    DB.models.postTradeHistories.create(
      {
        userId: user?.id,
        postId,
        type: BALANCE_TYPE.BALANCE,
        action,
        balance: user?.balance,
        cost: 0,
        balanceAfter: user?.balance,
      },
      { transaction: t }
    ),
  ]);
  return;
};

module.exports = {
  checkBalance,
  processingTransaction,
};

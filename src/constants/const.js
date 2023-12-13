const POST_STATUS = {
  APPROVED: 1,
  REPORTED: 2,
};

const ROLE = {
  USER: 0,
  ADMIN: 1,
};

const ADMIN_STATUS = {
  NO: 0,
  YES: 1,
};

const MESSAGES_STATUS = {
  READ: 1,
  UNREAD: 2,
};

const ROLE_TABLE = {
  USER: 'users',
  ADMIN: 'admin_users',
};

const MEDIABLE_TYPE = {
  POST: 'posts',
  COMMENT: 'comments',
  REPORT: 'reports',
  USER: 'users',
  REPORT_USER: 'report_users',
};

const NOTIFICATION_CHECK = {
  CHECKED: 1,
  UNCHECKED: 2,
};

const NOTIFICATION_STATUS = {
  READ: 1,
  UNREAD: 2,
};

const NOTIFICATION_TYPE = {
  LIKE_POST: 1,
  SHARE: 2,
  COMMENT: 3,
  FOLLOW: 4,
  MENTION: 5,
  DIRECT_MESSAGE: 6,
  ADMIN: 7,
  POST_FOLLOW: 8,
  ADMIN_POST: 9,
  ADMIN_BANNED: 10,
  LIKE_COMMENT: 11,
  REPLY: 12,
};

const NOTIFICATION_ACTION_TYPE = {
  POST: 'posts',
  COMMENT: 'comments',
  LIKES: 'likes',
  SHARES: 'shares',
  FOLLOWS: 'followers',
  USERS: 'users',
};
const MEDIA_LINK = {
  LINK: 'link/url',
};

const LIKEABLE_TYPE = {
  POST: 'posts',
  COMMENT: 'comments',
};

const TOKEN = {
  USER4:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  USER6:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIzfQ.8HSWFxb2lQj3bZVjGcL1vH1DBESmivBZApDeQKMCkco',
};

const DEFAULT_PER_PAGE = 10;
const DEFAULT_CURRENT_PAGE = 1;
const DEFAULT_PARENT_COMMENT = 0;

const ENV = {
  PROD: 'prod',
  STAGING: 'staging',
  DEV: 'dev',
};

const USER_IS_BAN = {
  IS_BAN: true,
  IS_NOT_BAN: false,
};

const FOLDER_AWS = {
  POST: 'post',
  REPORT: 'report',
  SUPPORT: 'support',
};

const REPORT_USERS_REASON = {
  PRETENDING_SOMEONE: 1,
  FAKE_ACCOUNT: 2,
  FAKE_NAME: 3,
  POSTING_INAPPROPRIATE: 4,
  HARASSMENT_BULLYING: 5,
  SOMETHING_ELSE: 6,
};

const LOCALE_COMPARE = {
  TRUE: 0,
  FALSE: 1,
};

const USER_POPULAR_STATUS = {
  IS_POPULAR: 1,
  NOT_POPULAR: 0,
};

const POST_TYPE = {
  POSTS: 'posts',
  SHARES: 'shares',
};

const ACTION_POST = {
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  SHARE: 'SHARE',
};
const BALANCE_TYPE = {
  BALANCE: 'BALANCE',
  BALANCE_LOCK: 'BALANCE_LOCK',
};

const DEFAULT_CMC_RANK_USER = 1000000;

module.exports = {
  ROLE,
  POST_STATUS,
  ADMIN_STATUS,
  MESSAGES_STATUS,
  ROLE_TABLE,
  MEDIABLE_TYPE,
  NOTIFICATION_CHECK,
  NOTIFICATION_STATUS,
  NOTIFICATION_TYPE,
  NOTIFICATION_ACTION_TYPE,
  MEDIA_LINK,
  LIKEABLE_TYPE,
  TOKEN,
  DEFAULT_PER_PAGE,
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PARENT_COMMENT,
  ENV,
  USER_IS_BAN,
  FOLDER_AWS,
  REPORT_USERS_REASON,
  LOCALE_COMPARE,
  USER_POPULAR_STATUS,
  POST_TYPE,
  DEFAULT_CMC_RANK_USER,
  ACTION_POST,
  BALANCE_TYPE,
};

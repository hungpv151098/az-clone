var DataTypes = require('sequelize').DataTypes;
var _sequelizeMeta = require('./sequelizeMeta');
var _prismaMigrations = require('./prismaMigrations');
var _adminExtensionHistories = require('./adminExtensionHistories');
var _adminExtensions = require('./adminExtensions');
var _adminMenu = require('./adminMenu');
var _adminPermissionMenu = require('./adminPermissionMenu');
var _adminPermissions = require('./adminPermissions');
var _adminRoleMenu = require('./adminRoleMenu');
var _adminRolePermissions = require('./adminRolePermissions');
var _adminRoleUsers = require('./adminRoleUsers');
var _adminRoles = require('./adminRoles');
var _adminSettings = require('./adminSettings');
var _adminUsers = require('./adminUsers');
var _chatMessages = require('./chatMessages');
var _comments = require('./comments');
var _coutries = require('./coutries');
var _cryptoPrices = require('./cryptoPrices');
var _displayedNotifications = require('./displayedNotifications');
var _failedJobs = require('./failedJobs');
var _followers = require('./followers');
var _likes = require('./likes');
var _mailLogs = require('./mailLogs');
var _medias = require('./medias');
var _migrations = require('./migrations');
var _miners = require('./miners');
var _miningHistories = require('./miningHistories');
var _miningSessions = require('./miningSessions');
var _notificationAdmin = require('./notificationAdmin');
var _notificationTemplate = require('./notificationTemplate');
var _notifications = require('./notifications');
var _passwordResets = require('./passwordResets');
var _personalAccessTokens = require('./personalAccessTokens');
var _postTags = require('./postTags');
var _posts = require('./posts');
var _reports = require('./reports');
var _shares = require('./shares');
var _systemConfigs = require('./systemConfigs');
var _tags = require('./tags');
var _tokenPurchaseHistories = require('./tokenPurchaseHistories');
var _tokens = require('./tokens');
var _users = require('./users');
var _reportUsers = require('./reportUsers');
var _sensitiveWords = require('./sensitiveWords');
var _blockUsers = require('./blockUsers');
var _hiddenPosts = require('./hiddenPosts');
var _postTradeHistories = require('./postTradeHistories');
var _faqCategory = require('./faqCategory');
var _faq = require('./faq');
var _supportProdcut = require('./supportProduct');
var _supportCategory = require('./supportCategory');
var _questionWidget = require('./questionWidget');
var _supportCategoryQuestion = require('./supportCategoryQuestion');
var _supportTicket = require('./supportTicket');
var _supportTicketDetail = require('./supportTicketDetail');
var _mediaTicket = require('./mediaTicket');

function initModels(sequelize) {
  var sequelizeMeta = _sequelizeMeta(sequelize, DataTypes);
  var prismaMigrations = _prismaMigrations(sequelize, DataTypes);
  var adminExtensionHistories = _adminExtensionHistories(sequelize, DataTypes);
  var adminExtensions = _adminExtensions(sequelize, DataTypes);
  var adminMenu = _adminMenu(sequelize, DataTypes);
  var adminPermissionMenu = _adminPermissionMenu(sequelize, DataTypes);
  var adminPermissions = _adminPermissions(sequelize, DataTypes);
  var adminRoleMenu = _adminRoleMenu(sequelize, DataTypes);
  var adminRolePermissions = _adminRolePermissions(sequelize, DataTypes);
  var adminRoleUsers = _adminRoleUsers(sequelize, DataTypes);
  var adminRoles = _adminRoles(sequelize, DataTypes);
  var adminSettings = _adminSettings(sequelize, DataTypes);
  var adminUsers = _adminUsers(sequelize, DataTypes);
  var chatMessages = _chatMessages(sequelize, DataTypes);
  var comments = _comments(sequelize, DataTypes);
  var coutries = _coutries(sequelize, DataTypes);
  var cryptoPrices = _cryptoPrices(sequelize, DataTypes);
  var displayedNotifications = _displayedNotifications(sequelize, DataTypes);
  var failedJobs = _failedJobs(sequelize, DataTypes);
  var followers = _followers(sequelize, DataTypes);
  var likes = _likes(sequelize, DataTypes);
  var mailLogs = _mailLogs(sequelize, DataTypes);
  var medias = _medias(sequelize, DataTypes);
  var migrations = _migrations(sequelize, DataTypes);
  var miners = _miners(sequelize, DataTypes);
  var miningHistories = _miningHistories(sequelize, DataTypes);
  var miningSessions = _miningSessions(sequelize, DataTypes);
  var notificationAdmin = _notificationAdmin(sequelize, DataTypes);
  var notificationTemplate = _notificationTemplate(sequelize, DataTypes);
  var notifications = _notifications(sequelize, DataTypes);
  var passwordResets = _passwordResets(sequelize, DataTypes);
  var personalAccessTokens = _personalAccessTokens(sequelize, DataTypes);
  var postTags = _postTags(sequelize, DataTypes);
  var posts = _posts(sequelize, DataTypes);
  var reports = _reports(sequelize, DataTypes);
  var shares = _shares(sequelize, DataTypes);
  var systemConfigs = _systemConfigs(sequelize, DataTypes);
  var tags = _tags(sequelize, DataTypes);
  var tokenPurchaseHistories = _tokenPurchaseHistories(sequelize, DataTypes);
  var tokens = _tokens(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var reportUsers = _reportUsers(sequelize, DataTypes);
  var sensitiveWords = _sensitiveWords(sequelize, DataTypes);
  var blockUsers = _blockUsers(sequelize, DataTypes);
  var hiddenPosts = _hiddenPosts(sequelize, DataTypes);
  var postTradeHistories = _postTradeHistories(sequelize, DataTypes);
  var faqCategory = _faqCategory(sequelize, DataTypes);
  var faq = _faq(sequelize, DataTypes);
  var supportProduct = _supportProdcut(sequelize, DataTypes);
  var supportCategory = _supportCategory(sequelize, DataTypes);
  var questionWidget = _questionWidget(sequelize, DataTypes);
  var supportCategoryQuestion = _supportCategoryQuestion(sequelize, DataTypes);
  var supportTicket = _supportTicket(sequelize, DataTypes);
  var supportTicketDetail = _supportTicketDetail(sequelize, DataTypes);
  var mediaTicket = _mediaTicket(sequelize, DataTypes);

  faqCategory.hasMany(faq, {
    as: 'faq',
    foreignKey: 'categoryId',
    onDelete: 'CASCADE',
  });

  supportTicket.hasMany(supportTicketDetail, {
    as: 'supportTicketDetail',
    foreignKey: 'supportTicketId',
    onDelete: 'CASCADE',
  });

  supportProduct.hasMany(supportCategory, {
    as: 'supportCategory',
    foreignKey: 'supportProductId',
    onDelete: 'CASCADE',
  });

  supportCategoryQuestion.hasMany(supportTicketDetail, {
    as: 'supportTicketDetail',
    foreignKey: 'categoryQuestionId',
    onDelete: 'CASCADE',
  });

  supportCategoryQuestion.belongsTo(supportCategory, {
    as: 'supportCategory',
    foreignKey: 'supportCategoryId',
    onDelete: 'CASCADE',
  });

  supportCategory.hasMany(supportCategoryQuestion, {
    as: 'supportCategoryQuestion',
    foreignKey: 'supportCategoryId',
    onDelete: 'CASCADE',
  });

  supportCategoryQuestion.belongsTo(questionWidget, {
    as: 'questionWidget',
    foreignKey: 'questionWidgetId',
    onDelete: 'CASCADE',
  });

  questionWidget.hasMany(supportCategoryQuestion, {
    as: 'supportCategoryQuestion',
    foreignKey: 'questionWidgetId',
    onDelete: 'CASCADE',
  });

  users.belongsTo(adminUsers, { as: 'admin', foreignKey: 'adminId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
  adminUsers.hasOne(users, { as: 'users', foreignKey: 'adminId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
  posts.belongsTo(adminUsers, { as: 'admin', foreignKey: 'adminId', onDelete: 'CASCADE' });
  adminUsers.hasMany(posts, { as: 'posts', foreignKey: 'adminId', onDelete: 'CASCADE' });
  users.belongsTo(coutries, {
    as: 'countryCodeCoutry',
    foreignKey: 'countryCode',
  });
  coutries.hasMany(users, { as: 'users', foreignKey: 'countryCode' });
  miningSessions.belongsTo(miners, { as: 'miner', foreignKey: 'minerId' });
  miners.hasMany(miningSessions, {
    as: 'miningSessions',
    foreignKey: 'minerId',
  });
  comments.belongsTo(posts, { foreignKey: 'postId', onDelete: 'CASCADE' });
  posts.hasMany(comments, { foreignKey: 'postId', onDelete: 'CASCADE' });
  postTags.belongsTo(posts, { foreignKey: 'postId', onDelete: 'CASCADE' });
  posts.hasMany(postTags, { foreignKey: 'postId', onDelete: 'CASCADE' });
  reports.belongsTo(posts, { foreignKey: 'postId' });
  posts.hasMany(reports, { foreignKey: 'postId', onDelete: 'CASCADE' });
  shares.belongsTo(posts, { foreignKey: 'postId', onDelete: 'CASCADE' });
  posts.hasMany(shares, { foreignKey: 'postId', onDelete: 'CASCADE' });
  postTags.belongsTo(tags, { foreignKey: 'tagId' });
  tags.hasOne(postTags, { foreignKey: 'tagId' });
  chatMessages.belongsTo(users, {
    foreignKey: 'receiverUserId',
  });
  users.hasMany(chatMessages, {
    foreignKey: 'receiverUserId',
  });
  chatMessages.belongsTo(users, {
    foreignKey: 'senderUserId',
  });
  users.hasMany(chatMessages, {
    foreignKey: 'senderUserId',
  });
  comments.belongsTo(users, { foreignKey: 'userId', onDelete: 'CASCADE' });
  users.hasMany(comments, { foreignKey: 'userId', onDelete: 'CASCADE' });
  comments.belongsTo(users, { foreignKey: 'replyId', as: 'replyUser', onDelete: 'CASCADE' });
  users.hasOne(comments, { foreignKey: 'replyId', onDelete: 'CASCADE' });
  followers.belongsTo(users, { foreignKey: 'followingId', as: 'following' });
  users.hasOne(followers, { foreignKey: 'followingId' });
  followers.belongsTo(users, { foreignKey: 'followerId', as: 'follower' });
  users.hasOne(followers, {
    foreignKey: 'followerId',
  });
  likes.belongsTo(users, { foreignKey: 'userId' });
  users.hasMany(likes, { foreignKey: 'userId' });
  notifications.belongsTo(users, { foreignKey: 'userId' });
  users.hasMany(notifications, { foreignKey: 'userId' });
  notifications.belongsTo(users, { foreignKey: 'fireUserId', as: 'fireUser' });
  users.hasMany(notifications, { foreignKey: 'fireUserId', as: 'fireUser' });
  notifications.belongsTo(adminUsers, { as: 'admin', foreignKey: 'adminId' });
  adminUsers.hasMany(notifications, { as: 'notifications', foreignKey: 'adminId' });
  posts.belongsTo(users, { foreignKey: 'userId' });
  users.hasMany(posts, { foreignKey: 'userId' });
  reports.belongsTo(users, { foreignKey: 'userId' });
  users.hasMany(reports, { foreignKey: 'userId' });
  shares.belongsTo(users, { foreignKey: 'userId' });
  users.hasMany(shares, { foreignKey: 'userId' });

  comments.hasMany(medias, {
    foreignKey: 'mediableId',
    constraints: false,
    scope: {
      mediableType: 'comments',
    },
    onDelete: 'CASCADE',
  });

  medias.belongsTo(comments, { foreignKey: 'mediableId', constraints: false, onDelete: 'CASCADE' });
  posts.hasMany(medias, {
    foreignKey: 'mediableId',
    constraints: false,
    scope: {
      mediableType: 'posts',
    },
    onDelete: 'CASCADE',
  });

  medias.belongsTo(posts, { foreignKey: 'mediableId', constraints: false, onDelete: 'CASCADE' });
  posts.hasOne(medias, {
    foreignKey: 'mediableId',
    constrants: false,
    scope: {
      mediableType: 'posts',
    },
    onDelete: 'CASCADE',
    as: 'link',
  });
  medias.belongsTo(posts, { foreignKey: 'mediableId', constraints: false, as: 'link', onDelete: 'CASCADE' });
  reports.hasMany(medias, {
    foreignKey: 'mediableId',
    constraints: false,
    scope: {
      mediableType: 'reports',
    },
  });
  medias.belongsTo(reports, { foreignKey: 'mediableId', constraints: false, onDelete: 'CASCADE' });
  users.hasMany(medias, {
    foreignKey: 'mediableId',
    constraints: false,
    scope: {
      mediableType: 'users',
    },
    onDelete: 'CASCADE',
  });
  posts.hasMany(likes, {
    foreignKey: 'likeableId',
    constraints: false,
    scope: {
      likeableType: 'posts',
    },
    onDelete: 'CASCADE',
  });
  likes.belongsTo(posts, { foreignKey: 'likeableId', constraints: false, onDelete: 'CASCADE' });
  comments.hasMany(likes, {
    foreignKey: 'likeableId',
    constraints: false,
    scope: {
      likeableType: 'comments',
    },
    onDelete: 'CASCADE',
  });
  likes.belongsTo(comments, { foreignKey: 'likeableId', constraints: false, onDelete: 'CASCADE' });

  comments.hasMany(comments, {
    foreignKey: 'comment_parent_id',
    as: 'replies',
    onDelete: 'CASCADE',
  });
  notifications.belongsTo(notificationAdmin, {
    as: 'notificationAdmin',
    foreignKey: 'notificationAdminId',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  });
  notificationAdmin.hasMany(notifications, {
    as: 'notifications',
    foreignKey: 'notificationAdminId',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  });

  displayedNotifications.belongsTo(users, {
    as: 'notificationUser',
    foreignKey: 'notificationUserId',
    onDelete: 'CASCADE',
  });
  users.hasMany(displayedNotifications, {
    as: 'displayedNotifications',
    foreignKey: 'notificationUserId',
    onDelete: 'CASCADE',
  });
  displayedNotifications.belongsTo(users, { as: 'user', foreignKey: 'userId', onDelete: 'CASCADE' });
  users.hasMany(displayedNotifications, {
    as: 'userDisplayedNotifications',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  });
  users.hasMany(reportUsers, { as: 'users', foreignKey: 'userId', onDelete: 'CASCADE' });
  reportUsers.belongsTo(users, { as: 'report', foreignKey: 'reportId', onDelete: 'CASCADE' });
  users.hasMany(reportUsers, { as: 'reportUsers', foreignKey: 'reportId', onDelete: 'CASCADE' });
  reportUsers.belongsTo(users, { as: 'user', foreignKey: 'userId', onDelete: 'CASCADE' });

  posts.belongsTo(posts, {
    foreignKey: 'post_share_id',
    as: 'share',
    onDelete: 'CASCADE',
  });
  users.hasMany(postTradeHistories, { foreignKey: 'userId', onDelete: 'CASCADE' });
  postTradeHistories.belongsTo(users, { foreignKey: 'userId', onDelete: 'CASCADE' });
  posts.hasMany(postTradeHistories, { foreignKey: 'postId', onDelete: 'CASCADE' });
  postTradeHistories.belongsTo(posts, { foreignKey: 'postId', onDelete: 'CASCADE' });

  return {
    sequelizeMeta,
    prismaMigrations,
    adminExtensionHistories,
    adminExtensions,
    adminMenu,
    adminPermissionMenu,
    adminPermissions,
    adminRoleMenu,
    adminRolePermissions,
    adminRoleUsers,
    adminRoles,
    adminSettings,
    adminUsers,
    chatMessages,
    comments,
    coutries,
    cryptoPrices,
    displayedNotifications,
    failedJobs,
    followers,
    likes,
    mailLogs,
    medias,
    migrations,
    miners,
    miningHistories,
    miningSessions,
    notificationAdmin,
    notificationTemplate,
    notifications,
    passwordResets,
    personalAccessTokens,
    postTags,
    posts,
    reports,
    shares,
    systemConfigs,
    tags,
    tokenPurchaseHistories,
    tokens,
    users,
    reportUsers,
    sensitiveWords,
    blockUsers,
    hiddenPosts,
    postTradeHistories,
    faqCategory,
    faq,
    supportProduct,
    supportCategory,
    questionWidget,
    supportCategoryQuestion,
    supportTicket,
    supportTicketDetail,
    mediaTicket,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

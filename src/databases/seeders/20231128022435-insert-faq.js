'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'faq',
      [
        {
          question: 'I entered incorrect information when opening an account, how can I change it?',
          answer:
            'When you open an account, you can freely choose a name and username. It does not affect your account. When we request verification of information, you will provide your personal information later',
          category_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          question: 'I cannot log into my account; the system notify that "unusual access"',
          answer:
            'You will receive this notification if you enter the wrong password multiple times. After a few hours, kindly reset your password and try logging in again',
          category_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          question: 'I forgot my password to log into my account',
          answer:
            'Kindly reset your password by selecting "Forgot password" at the login screen and following the instructions.',
          category_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          question: 'I did not receive 4 AZC when I opened the account',
          answer:
            '4 AZC is a reward when you are referred by someone. You need to enter the referral code when creating an account',
          category_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          question: "I can't find where to enter the referral code",
          answer: 'You can only enter the referral code the first time you create an account.',
          category_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          question: "I don't know where to get my referral code",
          answer: 'Kindly refer to the App instructions in Section II.2',
          category_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          question: 'My friend used my referral link, but the system did not recognize it',
          answer:
            'Referral link effectiveness may vary based on devices and social media platforms.\nFor example, when you send the link via Facebook, Facebook may mark the link as its own. It will affect the system tracking.\nTo ensure accurate recognition, kindly use referral codes instead.',
          category_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          question: 'My application is not working',
          answer:
            'You can try reinstalling the app from Google Play/App Store.\nOr download the APK version directly from our official website: https://azcoiner.com/ (Kindly uninstall the old version before downloading the APK version)',
          category_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          question: "I don't know how to connect AZCoiner wallet to web3 sites.",
          answer:
            'When you want to connect an AZCoiner wallet with web3 sites, kindly follow the instructions:\n1. Select Web3 Browser in III.2.\n2. Enter the web3 domain that you want to access.\n3. Choose "Connect", then select "Browser Wallet".',
          category_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          question: "I can't find the KYC section.",
          answer:
            'KYC has not started yet, so there is no KYC section in the app.\nKindly follow us to receive the earliest notifications about KYC',
          category_id: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          question: 'When will the AZC be listed? What is the total supply?',
          answer:
            'We are currently focusing on developing the ecosystem, bringing real value and benefits to the community.\nThis will bring true value to AZC. Therefore, we do not have a plan for listing yet.\nWe will make a public announcement when there is a specific plan',
          category_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          question: 'I would like to know the official channels/communities of AZCoiner',
          answer:
            'AZCoiner community:\nTwitter/X: https://twitter.com/AZCoiner\nFacebook: https://www.facebook.com/AZCoinerApp\nYoutube: https://www.youtube.com/@AZCoiner\nTelegram: https://t.me/AZCoinerChannel',
          category_id: 5,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          question: 'How do I contact AZCoiner support?',
          answer:
            'Kindly fill in detailed information in the following form:\nhttps://forms.gle/QXLUvJmR1VgwVbMf7\nOr contact us directly via email: support@azcoiner.com',
          category_id: 6,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          question: 'I would like to contact for cooperation with AZCoiner',
          answer: 'Kindly send detailed information via email to: contact@azcoiner.com',
          category_id: 6,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('faq', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};

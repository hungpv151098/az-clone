'use strict';
const fs = require('fs');
const path = require('path')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Tên tệp chứa danh sách các từ
    const fileName = path.resolve('src/databases/seeders/data','sensitiveWords.txt');

    // Đọc nội dung của tệp
    const data = fs.readFileSync(fileName, 'utf-8');

    // Tách dòng thành một mảng các từ
    const words = data.split('\n');
    let dataInsert = [];
    // Lặp qua danh sách các từ và làm gì đó với từng từ
    for (let i = 0; i < words.length; i++) {
      dataInsert.push({ word: words[i], lang: 'en', created_at: new Date(), updated_at: new Date() });
    }
    await queryInterface.bulkInsert('sensitive_words', dataInsert, {});

    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('sensitive_words', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};

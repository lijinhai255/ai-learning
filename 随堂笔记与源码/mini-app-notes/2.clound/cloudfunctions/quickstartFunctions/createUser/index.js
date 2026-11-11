const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 修改数据库信息云函数入口函数
exports.main = async () => {
  try {
    db.collection('user').add({
      data: {
        name: 'heer'
      }
    })
    return {
      success: true,
      data: {}
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};

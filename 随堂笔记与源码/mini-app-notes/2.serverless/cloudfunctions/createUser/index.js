const getOpenId = require('./createUser');

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'createUser':
      return await getOpenId.main(event, context);
  }
};
        

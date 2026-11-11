// helloWorld/index.js
const db = uniCloud.database();

exports.main = async (event, context) => {
    // // 插入数据
    // await db.collection('users').add({
    //     name: event.name,
    //     createdAt: db.serverDate()
    // });

    // // 查询数据
    // const result = await db.collection('users').get();
    
    // return {
    //     users: result.data
    // };
	
	return 1 + 1;
};
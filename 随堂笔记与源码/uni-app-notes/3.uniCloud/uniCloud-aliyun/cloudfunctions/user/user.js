const db = uniCloud.database();

exports.main = async (event, context) => {
    // 插入数据
    await db.collection('users').add({
        name: event.name,
        createdAt: db.serverDate()
    });

    // 查询数据
    const result = await db.collection('users').get();
	
	await db.collection("users").where({
		id: 1
	}).update({
		name: 'heyi'
	})
    
    return {
        users: result.data
    };
};
import { View, Text } from "@tarojs/components";
import "./index.scss";
import Taro, { useRouter, useLoad } from "@tarojs/taro";
import { useState } from "react";

export default function Index() {
  const router = useRouter();
  const [topics, setTopics] = useState([]);
  console.log("🚀 ~ file: index.tsx:30 ~ Index ~ router:", router);
  useLoad(() => {
    console.log("Page loaded.");
    // 获取路由参数
    const location = Taro.getCurrentInstance().router?.params;
    console.log("🚀 ~ useLoad ~ location:", location);

    // fetch("", {})

    // Taro.request 就是将 小程序的 wx.request、h5 的 fetch 封装了，为了抹平差异
    // 数据请求
    Taro.request({
      url: "https://cnodejs.org/api/v1/topics",
      method: "GET",
      success: (res) => {
        console.log(res.data);
        setTopics(res.data.data);
      },
      fail: (error) => {
        console.error(error);
      },
    });
  });

  return (
    <View className="index">
      <Text>Hello world! {router.params.name}</Text>
      <View>
        {topics.map((topic) => {
          return <Text key={topic.id}>{topic.title}</Text>;
        })}
      </View>
    </View>
  );
}

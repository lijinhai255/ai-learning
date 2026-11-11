import { View, Text, Icon, Progress, Image, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Header from "../../components/Header/Header";
import { sum } from "../../utils/sum";
import { useEffect } from "react";
import "./index.scss";

export default function User() {
  useEffect(() => {
    console.log(sum(1, 2));
  }, []);
  const handleClick = () => {
    Taro.navigateTo({
      // url: "../index/index"
      url: "/pages/index/index?name=heyi",
    });
  };

  const handleTip = () => {
    Taro.showToast({
      title: "提示",
      icon: "none",
      duration: 2000,
    });
  };

  return (
    <View className="user">
      <Header />
      <Icon size={60} type="success" />
      <Progress percent={20} showInfo strokeWidth={2} />
      <View
        style={{
          backgroundColor: "#1400BA",
        }}
      >
        <Image src="https://docs.taro.zone/img/logo-taro.png" />
      </View>
      <Text>Hello User!</Text>
      <Button onClick={handleClick}>跳到 index</Button>
      {process.env.TARO_ENV === "h5" ? (
        <Button onClick={handleTip}>提示</Button>
      ) : null}
    </View>
  );
}

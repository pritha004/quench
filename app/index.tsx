import CustomButton from "@/components/Button";
import { images } from "@/constants";
import { useAuth } from "@/context/auth-context";
import { Redirect, router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React from "react";
import { ImageBackground, Text, View } from "react-native";

const Index = () => {
  const { isLoadingUser, user } = useAuth();

  if (!isLoadingUser && user) return <Redirect href="/home" />;

  return (
    <>
      <View className="bg-black flex-1">
        <ImageBackground
          source={images.bgLanding}
          resizeMode="cover"
          className="flex-1"
        >
          <View className="w-full h-[92vh] justify-end items-center">
            <View className="relative mt-5">
              <Text className="text-4xl text-textprimary uppercase text-center font-raleway font-bold ">
                Quench
              </Text>
            </View>
            <Text className="text-xl font-pregular text-textsecondary mt-2 text-center font-inter-italic">
              Track your water effortlessly.
            </Text>
            <CustomButton
              child={
                <View className="bg-cta rounded-full mt-10 p-4 animate-bounce">
                  <ArrowRight color={"black"} />
                </View>
              }
              handlePress={() => router.push("/sign-in")}
              containerStyles="w-full"
            />
          </View>
        </ImageBackground>
      </View>
    </>
  );
};

export default Index;

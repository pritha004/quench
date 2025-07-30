import CustomButton from "@/components/Button";
import FormField from "@/components/FormField";
import { images } from "@/constants";
import { useAuth } from "@/context/auth-context";
import { getCurrentUser, signin } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setUser } = useAuth();

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields.");
    }

    setIsSubmitting(true);
    try {
      await signin(form.email, form.password);
      const result: any = await getCurrentUser();
      setUser(result);

      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Error", error?.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="bg-bg h-full">
      <ScrollView>
        <View className="flex-1 justify-center items-center px-4 my-8">
          <Image
            source={images.logo}
            resizeMode="cover"
            className="w-[200px] h-[200px]"
          />
          <Text className="text-3xl text-textprimary font-semibold font-raleway py-2">
            Welcome Back
          </Text>
          <Text className="text-lg text-textsecondary font-inter-italic">
            Continue your hydration journey.
          </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e: any) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e: any) => setForm({ ...form, password: e })}
            otherStyles="mt-6"
          />
          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have account?
            </Text>
            <Link href={"/sign-up"} className="text-lg font-bold text-accent">
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

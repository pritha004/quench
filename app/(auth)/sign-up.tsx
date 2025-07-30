import CustomButton from "@/components/Button";
import FormField from "@/components/FormField";
import { images } from "@/constants";
import { useAuth } from "@/context/auth-context";
import { signup } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setUser } = useAuth();

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields.");
    }

    setIsSubmitting(true);
    try {
      const result: any = await signup(
        form.email,
        form.password,
        form.username
      );
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
            Start Sipping Smart
          </Text>
          <Text className="text-lg text-textsecondary font-inter-italic">
            Build a better hydration habit.
          </Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e: any) => setForm({ ...form, username: e })}
            otherStyles="mt-8"
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e: any) => setForm({ ...form, email: e })}
            otherStyles="mt-6"
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
              Have an account already?
            </Text>
            <Link href={"/sign-in"} className="text-lg font-bold text-accent">
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

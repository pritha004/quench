import ActivityRings from "@/components/ActivityRing";
import CustomButton from "@/components/Button";
import { home } from "@/constants";
import { useAuth } from "@/context/auth-context";
import { Plus } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const { user } = useAuth();

  return (
    <SafeAreaView className="bg-bg flex-1 p-4">
      <View className="flex-row items-center gap-4 py-4">
        <View className="h-20 w-20 bg-slate-50 rounded-full items-center justify-center">
          <Text className="text-black text-3xl">
            {user?.name
              .split(" ")
              .map((w) => w.charAt(0))
              .join("")}
          </Text>
        </View>
        <View>
          <Text className="text-xl text-textprimary font-inter">Hello</Text>
          <Text className="text-4xl text-textprimary font-extrabold font-raleway">
            {user?.name}
          </Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className="my-2">
        <View className="flex-col bg-surface rounded-lg my-2">
          <Text className="p-4 border-b-[1px] border-gray-600 text-xl font-bold text-textprimary">
            Activity Ring
          </Text>
          <View className="flex-row gap-8 items-center p-4">
            <View className="py-2">
              <ActivityRings percentage={80} />
            </View>
            <View>
              <Text className="text-lg font-semibold font-inter text-textprimary">
                Hydration
              </Text>
              <Text className="text-2xl font-raleway font-bold text-accent">
                100/2000 ml
              </Text>
            </View>
          </View>
        </View>
        <View className="flex-col bg-surface rounded-lg my-2">
          <Text className="p-4 border-b-[1px] border-gray-600 text-xl font-bold text-textprimary">
            Add H₂O
          </Text>
          <View className="flex-row flex-wrap gap-8 justify-start items-center p-4">
            {home.waterConsumedAmt.map(
              (op: { label: string; value: number }) => (
                <CustomButton
                  key={op.value}
                  title={op.label}
                  containerStyles="min-h-[40px] bg-transparent border-accent border-2 rounded-full w-1/4"
                  textStyles="text-textprimary"
                  handlePress={() => {}}
                />
              )
            )}
            <CustomButton
              handlePress={() => {}}
              child={
                <View className="bg-accent rounded-full p-3">
                  <Plus color={"black"} />
                </View>
              }
            />
          </View>
        </View>
        <View className="flex-col bg-surface rounded-lg mt-2 mb-12">
          <Text className="p-4 border-b-[1px] border-gray-600 text-xl font-bold text-textprimary">
            Today’s Sips
          </Text>
          <View className="flex-row gap-8 items-center p-4">
            <View className="py-2">
              {[
                { id: 1, intakeAmt: 100, intakeTime: "10:00" },
                { id: 2, intakeAmt: 200, intakeTime: "12:00" },
              ].map((rec) => (
                <View
                  key={rec.id}
                  className="w-full flex-row justify-between items-center p-2"
                >
                  <Text className="text-2xl  font-bold text-textprimary">
                    {rec.intakeAmt} ml
                  </Text>
                  <Text className="text-lg  font-bold text-textprimary">
                    {rec.intakeTime}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

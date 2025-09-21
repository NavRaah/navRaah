import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnboardingCard, PaginationDots } from "../../components";
import { useAuth } from "../../contexts";
import { ONBOARDING_DATA } from "../../lib";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { completeOnboarding } = useAuth();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const handleNext = async () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await completeOnboarding();
      router.replace("/(auth)/login" as any);
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace("/(auth)/login" as any);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Swipeable Content */}
        <FlatList
          ref={flatListRef}
          data={ONBOARDING_DATA}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ width }} className="px-10 flex items-center justify-center ">
              <OnboardingCard
                title={item.title}
                description={item.description}
                image={item.image}
              />
            </View>
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewConfigRef.current}
        />

        {/* Pagination Dots */}
        <PaginationDots totalDots={ONBOARDING_DATA.length} activeIndex={currentIndex} />

        {/* Bottom Buttons */}
        <View className="items-center pb-10 px-4">
          <TouchableOpacity
            onPress={handleNext}
            className="bg-blue-400 w-full py-4 rounded-3xl items-center"
          >
            <Text className="text-white font-semibold text-lg">
              {currentIndex === ONBOARDING_DATA.length - 1 ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSkip}
            className="mt-1 border border-blue-400 w-full py-4 rounded-3xl items-center"
          >
            <Text className="text-black text-base font-medium ">Skip & Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

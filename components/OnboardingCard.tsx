import React from 'react';
import { Text, View } from 'react-native';

interface OnboardingCardProps {
  title: string;
  description: string;
  image: string;
}

export default function OnboardingCard({ title, description, image }: OnboardingCardProps) {
  return (
    <View className="items-center">
      <Text className="text-4xl mb-6">{image}</Text>
      <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
        {title}
      </Text>
      <Text className="text-lg text-gray-600 text-center leading-6 px-4">
        {description}
      </Text>
    </View>
  );
}

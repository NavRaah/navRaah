import React from 'react';
import { View } from 'react-native';

interface PaginationDotsProps {
  totalDots: number;
  activeIndex: number;
}

export default function PaginationDots({ totalDots, activeIndex }: PaginationDotsProps) {
  return (
    <View className="flex-row justify-center mb-8">
      {Array.from({ length: totalDots }, (_, index) => (
        <View
          key={index}
          className={`w-2 h-2 rounded-full mx-1 ${
            index === activeIndex ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        />
      ))}
    </View>
  );
}

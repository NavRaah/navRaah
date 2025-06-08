import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

// Enhanced slide data with icons/emojis for visual appeal
const slides = [
  {
    key: '1',
    icon: '🧭',
    title: 'Welcome to NavRaah',
    description:
      'Your intelligent navigation companion. Discover efficient routes and reliable guidance for every journey.',
  },
  {
    key: '2',
    icon: '📊',
    title: 'Real-Time Intelligence',
    description:
      'Access live traffic data, weather updates, and smart insights to make informed travel decisions.',
  },
  {
    key: '3',
    icon: '🚀',
    title: 'Begin Your Journey',
    description:
      'Quick setup, intuitive interface, and seamless navigation. Start exploring with confidence.',
  },
];

// Enhanced Individual Slide Component
const Slide = ({item}) => (
  <View style={[styles.slide, {width}]}>
    <View style={styles.slideContent}>
      <Text style={styles.slideIcon}>{item.icon}</Text>
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideDescription}>{item.description}</Text>
    </View>
  </View>
);

// Enhanced Pagination Dots Component
const Pagination = ({data, currentIndex}) => (
  <View style={styles.paginationContainer}>
    {data.map((_, index) => (
      <View
        key={index}
        style={[
          styles.dot,
          currentIndex === index ? styles.activeDot : styles.inactiveDot
        ]}
      />
    ))}
  </View>
);

// Main Enhanced Landing Screen Component
const LandingScreen = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex < slides.length) {
      const offset = nextSlideIndex * width;
      flatListRef?.current?.scrollToOffset({offset, animated: true});
      setCurrentSlideIndex(nextSlideIndex);
    }
  };

  const skipToLast = () => {
    const lastIndex = slides.length - 1;
    const offset = lastIndex * width;
    flatListRef?.current?.scrollToOffset({offset, animated: true});
    setCurrentSlideIndex(lastIndex);
  };

  const progress = ((currentSlideIndex + 1) / slides.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fffe" />

      {/* Enhanced Header with progress */}
      <View style={styles.header}>
        <Text style={styles.logoText}>NavRaah</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, {width: `${progress}%`}]} />
        </View>
      </View>

      {/* Enhanced Carousel */}
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={slides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={updateCurrentSlideIndex}
          renderItem={({item}) => <Slide item={item} />}
          keyExtractor={item => item.key}
          bounces={false}
          decelerationRate="fast"
          snapToAlignment="center"
        />
      </View>

      <Pagination data={slides} currentIndex={currentSlideIndex} />

      {/* Enhanced Footer */}
      <View style={styles.footer}>
        {currentSlideIndex === slides.length - 1 ? (
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => navigation.replace('login')}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.bottomNav}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={skipToLast}
              activeOpacity={0.7}
            >
              <Text style={styles.navText}>Skip</Text>
            </TouchableOpacity>
            <View style={styles.slideCounter}>
              <Text style={styles.counterText}>
                {currentSlideIndex + 1} of {slides.length}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.navButton}
              onPress={goToNextSlide}
              activeOpacity={0.7}
            >
              <Text style={styles.navText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default LandingScreen;

// Enhanced Styles with white-green theme
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fffe',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 15,
    letterSpacing: 1,
  },
  progressContainer: {
    width: '60%',
    height: 4,
    backgroundColor: '#e6fffa',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    minHeight: height * 0.5,
  },
  slideContent: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  slideIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#047857',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  slideDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
    transition: 'all 0.3s ease',
  },
  activeDot: {
    backgroundColor: '#10b981',
    width: 24,
  },
  inactiveDot: {
    backgroundColor: '#d1fae5',
    width: 10,
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1fae5',
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  navText: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '600',
  },
  slideCounter: {
    backgroundColor: '#f0fdf4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  counterText: {
    fontSize: 14,
    color: '#047857',
    fontWeight: '500',
  },
  getStartedButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

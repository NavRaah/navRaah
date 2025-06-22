import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#002F6C',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: width * 0.5, // 40% of screen width
    height: width * 0.5, // Keep it square
    borderRadius: (width * 0.5) / 2, // Half of width for a circle
    marginBottom: 10,
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  tagline: {
    fontSize: 14,
    color: '#E0E0E0',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002F6C',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '400',
  },
  button: {
    backgroundColor: '#002F6C',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#7A9CC6',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotButton: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 10,
  },
  forgotText: {
    textAlign: 'center',
    color: '#002F6C',
    textDecorationLine: 'underline',
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#002F6C',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#002F6C',
    fontSize: 16,
    fontWeight: '600',
  },
});

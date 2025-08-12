// ErrorBoundary.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: any) {
    // Update state to show fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can log the error to an error reporting service here
    console.error('Error caught by ErrorBoundary: ', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    // Reload the app or reset the state
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong.</Text>
          <Text style={styles.errorText}>{this?.state?.error?.toString()}</Text>
          <Button title="Reload" onPress={this.handleReload} />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
});

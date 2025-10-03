import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BleProvider } from '../contexts/BleContext';
import Header from '../components/layout/Header';

const RootLayout = () => {

  const insets = useSafeAreaInsets();

  return(
    <View 
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: '#c7c7c7ff',
      }}>
            
      <BleProvider>
        <StatusBar backgroundColor='#838383ff' translucent={false} />
        <Stack screenOptions={{ 
          animation: 'slide_from_right',
          header: () => (
            <Header title='IMREA App'/>
          ),
        }}>
          <Stack.Screen name='index' options={{ title: 'Sign In' }} />
          <Stack.Screen name='(tabs)' options={{ headerShown: false, title: 'Sign In' }} />
        </Stack>
      </BleProvider>
    </View>
  );
};

export default RootLayout;
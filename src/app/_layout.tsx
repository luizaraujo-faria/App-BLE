import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BleProvider } from '../contexts/BleContext';

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
            backgroundColor: "#c7c7c7ff",
        }}>
            
            <BleProvider>
                <StatusBar backgroundColor="#838383ff" translucent={false} />
                <Stack screenOptions={{ animation: "slide_from_right" }}>
                    <Stack.Screen name="index" options={{ title: "Sign In" }} />
                    <Stack.Screen name="home" options={{ title: "Home" }} />
                </Stack>
            </BleProvider>
        </View>
  );
}

export default RootLayout;
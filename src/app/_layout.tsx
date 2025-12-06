import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Header from '../components/layout/Header';
import { BleProvider } from '@/src/contexts/BleContext';
import { useFonts } from 'expo-font';

const RootLayout = () => {

    const insets = useSafeAreaInsets();

    const [loaded] = useFonts({
        // eslint-disable-next-line no-undef
        AfacadFlux: require('@/assets/fonts/AfacadFlux-Regular.ttf'),
    });

    if (!loaded) {
        return null; // ou uma tela de loading
    }

    return(
        <BleProvider>
            <View 
                style={{
                    flex: 1,
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                    backgroundColor: '#595959ff',
                }}>
                
                <StatusBar backgroundColor='#838383ff' translucent={false} />
                <Stack screenOptions={{ 
                    animation: 'slide_from_right',
                    // header: () => (
                    //     <Header subtitle={null}/>
                    // ),
                }}>
                    <Stack.Screen name='index' options={{ headerShown: false }} />
                    <Stack.Screen name='(tabs)' options={{ headerShown: false, title: 'Fluxo' }} />
                </Stack>

            </View>
        </BleProvider>
    );
};

export default RootLayout;
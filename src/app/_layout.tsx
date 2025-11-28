import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../components/layout/Header';
import React from 'react';
import { BleProvider } from '@/src/contexts/BleContext';

const RootLayout = () => {

    const insets = useSafeAreaInsets();

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
                    header: () => (
                        <Header subtitle={null}/>
                    ),
                }}>
                    <Stack.Screen name='index' options={{ title: 'Sign In' }} />
                    <Stack.Screen name='(tabs)' options={{ headerShown: false, title: 'Fluxo' }} />
                </Stack>

            </View>
        </BleProvider>
    );
};

export default RootLayout;
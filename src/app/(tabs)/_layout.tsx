import { Tabs } from 'expo-router';
import TabBar from '@/src/components/layout/TabBar';
import React from 'react';
import { BleProvider } from '@/src/contexts/BleContext';
import { ListProvider } from '@/src/contexts/ListContext';

export default function TabLayout() {
    return (
        <BleProvider>
            <ListProvider>
                <Tabs
                    tabBar={props => <TabBar {...props}/>}
                    screenOptions={{
                        animation: 'shift',
                        tabBarActiveTintColor: '#007AFF',
                        tabBarInactiveTintColor: '#8E8E93',
                        headerShown: false,
                    }}>
                    <Tabs.Screen name='list'/>
                    <Tabs.Screen name='managment'/>
                    <Tabs.Screen name='settings'/>
                </Tabs>
            </ListProvider>
        </BleProvider>
    );
}
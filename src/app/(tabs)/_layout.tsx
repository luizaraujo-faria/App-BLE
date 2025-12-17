import { Tabs } from 'expo-router';
import TabBar from '@/src/components/layout/TabBar';
import React from 'react';

export default function TabLayout() {
    return (
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
    );
}
import { Tabs } from 'expo-router';
import TabBar from '@/src/components/layout/TabBar';

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
      <Tabs.Screen name='home'/>
      <Tabs.Screen name='managment'/>
      <Tabs.Screen name='person'/>
    </Tabs>
  );
}
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const tabConfig = {
  home: { icon: 'home', label: 'Início' },
  managment: { icon: 'bar-chart', label: 'Gestão' },
  person: { icon: 'person', label: 'Perfil' },
} as const;

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const config = tabConfig[route.name as keyof typeof tabConfig];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
          >
            <Ionicons 
              name={config.icon} 
              size={24} 
              color={isFocused ? '#fbbf24' : '#666666'} 
            />
            <Text style={[
              styles.label,
              isFocused && styles.labelActive,
            ]}>
              {config.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: '#666666',
  },
  labelActive: {
    color: '#fbbf24',
    fontWeight: '600',
  },
});

export default TabBar;
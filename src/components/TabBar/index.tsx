import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useList } from '@/src/contexts/ListContext';
import styles from './styles';

const tabConfig = {
    list: { icon: 'list', label: 'Registros' },
    managment: { icon: 'bar-chart', label: 'Gestão' },
    register: { icon: 'person', label: 'Cadastro' },
    settings: { icon: 'settings', label: 'Configurações' },
} as const;

const TabBar = ({ state, navigation }: BottomTabBarProps) => {

    // descriptors,
    const { count } = useList();

    return (
        <View style={styles.container}>
            {state.routes.map((route: any, index: number) => {
                // const { options } = descriptors[route.key];
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
                        <View style={{ position: 'relative' }}>
                            <Ionicons
                                name={config.icon} 
                                size={isFocused ? 22 : 20} 
                                color={isFocused ? '#ff9500ff' : '#666666'} 
                            />

                            {route.name === 'list' && count > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        !
                                    </Text>
                                </View>
                            )}
                        </View>
                        
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

export default TabBar;
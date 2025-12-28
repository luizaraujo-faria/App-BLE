import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useList } from '@/src/contexts/ListContext';

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
                                        {count}
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
        fontSize: 16,
        marginTop: 4,
        color: '#666666',
        fontFamily: 'AfacadFlux',
        display: 'none',
    },
    labelActive: {
        color: '#000000ff',
        fontWeight: '600',
        display: 'flex',
    },
    badge: {
        position: 'absolute',
        top: -6,
        right: -10,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#ff3b30',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#fff',
        fontSize: 8,
        fontWeight: 'bold',
    },
});

export default TabBar;
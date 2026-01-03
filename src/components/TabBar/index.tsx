import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';
import { useList } from '@/src/contexts/ListContext';
import styles from './styles';
import { FontAwesomeIcon, Ionicon, MaterialCommunityIcon } from '../Icons';

const tabConfig = {
    list: { 
        icon: <FontAwesomeIcon iconName='list-alt' iconColor='#000' iconSize={22} />, 
        label: 'Registros',
    },
    managment: { 
        icon: <MaterialCommunityIcon iconName='chart-areaspline' iconSize={24} iconColor='#000' />, 
        label: 'Gestão', 
    },
    register: { 
        icon: <Ionicon iconName='people' iconColor='#000' iconSize={24} />, 
        label: 'Cadastro',
    },
    settings: { 
        icon: <Ionicon iconName='settings-sharp' iconColor='#000' iconSize={24} />, 
        label: 'Configurações',
    },
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
                        <View style={[styles.iconContainer, isFocused && styles.iconContainerActive]}>
                            
                            {config.icon} 

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
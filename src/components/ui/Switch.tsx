import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Switch } from 'react-native-switch';

type Props = {
  label: string;
  value: boolean;
  onToggle: () => void;
};

export function SwitchItem({ label, value, onToggle }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <Switch
                value={value}
                onValueChange={onToggle}
                circleSize={22}
                barHeight={24}
                backgroundActive='#fbbf24'
                backgroundInactive='#d3d3d3'
                circleActiveColor='#fff'
                circleInActiveColor='#fff'
                renderActiveText={false}
                renderInActiveText={false}
                switchBorderRadius={16}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    label: {
        fontSize: 16,
        color: '#000',
    },
});
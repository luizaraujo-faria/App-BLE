import React from 'react';
import { View, Text } from 'react-native';
import { Switch } from 'react-native-switch';
import styles from './styles';

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
                switchBorderRadius={18}
                circleBorderWidth={0}
                switchLeftPx={2.5}
                switchRightPx={2.5}
            />
        </View>
    );
}
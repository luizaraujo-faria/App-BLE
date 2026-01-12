import React from 'react';
import { View } from 'react-native';
import { Switch } from 'react-native-switch';
import styles from './styles';
import { appColors } from '@/src/themes/colors';
import AppText from '../AppText';

type Props = {
  label: string;
  value: boolean;
  onToggle: () => void;
};

export function SwitchItem({ label, value, onToggle }: Props) {

    return (
        <View style={styles.container}>
            <AppText 
                text={label}
                textStyle={styles.label}
            />
            <Switch
                value={value}
                onValueChange={onToggle}
                circleSize={22}
                barHeight={25}
                backgroundActive={appColors.quintenary}
                backgroundInactive={appColors.primaryDisabled}
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
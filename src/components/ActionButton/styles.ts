import { appColors } from '@/src/themes/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    actionOption: {
        width: 80,
        height: 60,
        boxShadow: appColors.shadow,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    actionOptionDisabled: {
        backgroundColor: '#ccccccbe',
    },
});

export default styles;
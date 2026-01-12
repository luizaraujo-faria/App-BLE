import { appColors } from '@/src/themes/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    actionOption: {
        width: '40%',
        height: 60,
        // boxShadow: appColors.shadow,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    actionOptionDisabled: {
        backgroundColor: appColors.primaryDisabled,
    },
});

export default styles;
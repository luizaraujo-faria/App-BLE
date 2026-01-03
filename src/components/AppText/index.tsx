import React from 'react';
import { Text } from 'react-native';
import styles from './styles';

interface AppTextProps {
    text: string;
    textStyle: Object | null;
}

const AppText = ({ text, textStyle }: AppTextProps) => {

    return(
        <Text style={[styles.defaultTextStyle, textStyle && textStyle]}>
            {text}
        </Text>
    );
};

export default AppText;
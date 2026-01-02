import { View, Text, Image } from 'react-native';
import LogoIMREA from '@/assets/images/LogoIMREA.png';
import React from 'react';
import styles from './styles';

interface HeaderProps {
    subtitle: string | null;
}

const Header = ({ subtitle }: HeaderProps) => {

    return (
        <View style={styles.headerContainer}>

            <Image source={LogoIMREA} 
                style={styles.headerLogo}/>

            <View style={styles.texts}>
                <Text style={styles.headerTitle}>Gestão IMREA</Text>
                <Text style={subtitle ? styles.headerSubtitle : { display: 'none' }}>{subtitle}</Text>
            </View>

        </View>
    );
};

export default Header;
import { Ionicons } from '@expo/vector-icons';
import { Modal, View, Image, TouchableOpacity } from 'react-native';
import LogoIMREA from '../../../assets/images/LogoIMREA.png';
import React from 'react';
import styles from './styles';
import AppText from '../AppText';

interface PopupProps {
    title: string;
    message: string;
    visible: boolean;
    onClose: () => void;
}

const Popup = ({ title, message, visible, onClose }: PopupProps) => {

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType='fade'
        >
            <View style={styles.overlay}>
                <View style={styles.container}>

                    <View style={styles.header}>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <Image source={LogoIMREA} style={styles.logo}/>
            
                            <View style={styles.texts}>
                                <AppText 
                                    text={title}
                                    textStyle={styles.title}
                                />
                            </View>
                        </View>

                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name={'close'} size={24}/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.messageContainer}>
                        <AppText 
                            text={message}
                            textStyle={styles.message}
                        />
                    </View>

                </View>
            </View>
        </Modal>
    );
};

export default Popup;
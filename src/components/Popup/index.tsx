import { Ionicons } from '@expo/vector-icons';
import { Modal, View, Text, Image, TouchableOpacity } from 'react-native';
import LogoIMREA from '../../../assets/images/LogoIMREA.png';
import React from 'react';
import styles from './styles';

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
                                <Text style={styles.title}>{title}</Text>
                            </View>
                        </View>

                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name={'close'} size={24}/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.messageContainer}>
                        <Text style={styles.message}>{message}</Text>
                    </View>

                    {/* <View style={styles.actionContainer}>
                        <Button textButton='Fechar' style={styles.closeButton} disabled={false} onPress={onClose}/>
                    </View> */}
                </View>
            </View>
        </Modal>
    );
};

export default Popup;
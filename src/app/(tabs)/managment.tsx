import { StyleSheet, View } from 'react-native';
import Header from '@/src/components/layout/Header';

const ManagmentScreen = () => {
    return (
        <View style={{ flex: 1 }}>
            <Header subtitle={'IMREA'}/>
            
            <View style={style.container}>

            </View>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#f4f4f4ff',
        padding: 24,
    },
});

export default ManagmentScreen;
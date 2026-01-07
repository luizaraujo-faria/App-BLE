import { Barchart } from '@/src/components/Charts';
import { useMealChart } from '@/src/hooks/useChart';
import { appColors } from '@/src/themes/colors';
// import useDropdown from '@/src/hooks/useDropdown';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
// import DropDownPicker from 'react-native-dropdown-picker';

const ManagmentScreen = () => {

    const [containerWidth, setContainerWidth] = useState(0);
    const { data, loading } = useMealChart('1', '');

    // if(loading){
    //     return(
    //         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    //             <ActivityIndicator size={'large'} color={appColors.primary} />
    //         </View>
    //     );
    // };

    return (
        <View style={{ flex: 1 }}>
            
            <View style={style.container}>

                <View style={style.topBar}>

                    <TouchableOpacity style={style.actionBar}>
                        <Ionicons name='search' size={24}/>
                    </TouchableOpacity>

                </View>

                <View 
                    style={style.chartContainer}
                    onLayout={(event) => {
                        const { width } = event.nativeEvent.layout;
                        setContainerWidth(width);
                    }}
                >
                    {loading ? (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator size={'large'} color={appColors.primary} />
                        </View>
                    ): !data ? ( 
                        <Text>Nenhum dado carregado!</Text> 
                    ) : (
                        <Barchart 
                            data={data} 
                            containerWidth={containerWidth}
                        />
                    )}


                </View>

            </View>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#f4f4f4ff',
        padding: 24,
        gap: 16,
    },
    topBar: {
        width: '100%',
        height: '10%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        gap: 12,
    },
    actionBar: {
        width: 180,
        height: 55,
        boxShadow: '0px 0px 2px #94949475',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffffff',
        color: '#000',
        borderWidth: 0,
        position: 'relative',
    },
    chartContainer: {
        width: '100%',
        minHeight: 340,
        maxHeight: 380,
        boxShadow: '0px 0px 2px #a3a3a375',
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingVertical: 16,
        overflow: 'hidden',
    },
});

export default ManagmentScreen;
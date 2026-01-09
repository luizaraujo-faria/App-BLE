import { Barchart, Piechart } from '@/src/components/Charts';
import { useChart } from '@/src/hooks/useChart';
import { appColors } from '@/src/themes/colors';
import useDropdown from '@/src/hooks/useDropdown';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from '@/src/components/AppText';
import { appFonts } from '@/src/themes/fonts';
import ActionButton from '@/src/components/ActionButton';
import { MaterialCommunityIcon } from '@/src/components/Icons';
// import { AntDesignIcon, MaterialCommunityIcon } from '@/src/components/Icons';

const ManagmentScreen = () => {

    const months = [
        { id: '1', label: 'Janeiro' },
        { id: '2', label: 'Fevereiro' },
        { id: '3', label: 'Março' },
        { id: '4', label: 'Abril' },
        { id: '5', label: 'Maio' },
        { id: '6', label: 'Junho' },
        { id: '7', label: 'Julho' },
        { id: '8', label: 'Agosto' },
        { id: '9', label: 'Setembro' },
        { id: '10', label: 'Outubro' },
        { id: '11', label: 'Novembro' },
        { id: '12', label: 'Dezembro' },
    ];

    const turns = [
        { id: '1', label: 'Café da Manhã' },
        { id: '2', label: 'Almoço' },
        { id: '3', label: 'Café da Tarde' },
    ];

    const sectors = [
        { id: '1', label: 'Bioeng' },
        { id: '2', label: 'Nutri' },
        { id: '3', label: 'Fisio' },
    ];

    const monthDropdown = useDropdown(months.map(m => ({ value: m.id, label: m.label })));
    const turnDropdown = useDropdown(turns.map(t => ({ value: t.id, label: t.label })));
    const sectorDropdown = useDropdown(sectors.map(s => ({ value: s.id, label: s.label })));

    const [containerWidth, setContainerWidth] = useState(0);
    const screenHeight = Dimensions.get('window').height;

    const { data, loading } = useChart();

    return (
        <LinearGradient 
            colors={[appColors.secondary, appColors.primary]}
            style={styles.container}>

            <View style={styles.topBar}>

                <View
                    style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: '2%',
                        // paddingHorizontal: '1%',
                    }}
                >
                    <View style={{ width: '75%' }}>
                        <DropDownPicker
                            disabled={false}
                            open={monthDropdown.open}
                            value={monthDropdown.value}
                            items={monthDropdown.items}
                            setOpen={monthDropdown.setOpen}
                            setValue={monthDropdown.setValue}
                            setItems={monthDropdown.setItems}
                            placeholder={'Selecione o Mês'}
                            style={styles.monthDropdownBar}
                            dropDownContainerStyle={styles.monthDropdownContainer}
                            labelStyle={[styles.dropdownLabel, { fontSize: 18 }]}
                            placeholderStyle={styles.dropdownPlaceholder}
                            selectedItemContainerStyle={styles.selectedItemContainer}
                            selectedItemLabelStyle={styles.selectedItemLabel}
                            dropDownDirection='BOTTOM'
                            zIndex={5}
                        />
                    </View>

                    <View>
                        <ActionButton 
                            icon={<MaterialCommunityIcon 
                                iconName='reload'
                                iconSize={24}
                                iconColor='#000'
                            />} 
                            onPress={() => {}}   
                            style={{
                                height: 50,
                                width: 90,
                            }}                     
                        />
                    </View>
                </View>

                <View
                    style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: '2%',
                        paddingHorizontal: '1%',
                    }}
                >
                    <View style={{ width: '50%' }}>
                        <DropDownPicker
                            disabled={false}
                            open={turnDropdown.open}
                            value={turnDropdown.value}
                            items={turnDropdown.items}
                            setOpen={turnDropdown.setOpen}
                            setValue={turnDropdown.setValue}
                            setItems={turnDropdown.setItems}
                            placeholder={'Selecione o Turno'}
                            style={styles.dropdownBar}
                            dropDownContainerStyle={styles.dropdownContainer}
                            labelStyle={styles.dropdownLabel}
                            placeholderStyle={styles.dropdownPlaceholder}
                            selectedItemContainerStyle={styles.selectedItemContainer}
                            selectedItemLabelStyle={styles.selectedItemLabel}
                            dropDownDirection='BOTTOM'
                            zIndex={2}
                        />
                    </View>

                    <View style={{ width: '50%' }}>
                        <DropDownPicker
                            disabled={false}
                            open={sectorDropdown.open}
                            value={sectorDropdown.value}
                            items={sectorDropdown.items}
                            setOpen={sectorDropdown.setOpen}
                            setValue={sectorDropdown.setValue}
                            setItems={sectorDropdown.setItems}
                            placeholder={'Selecione o Setor'}
                            style={styles.dropdownBar}
                            dropDownContainerStyle={styles.dropdownContainer}
                            labelStyle={styles.dropdownLabel}
                            placeholderStyle={styles.dropdownPlaceholder}
                            selectedItemContainerStyle={styles.selectedItemContainer}
                            selectedItemLabelStyle={styles.selectedItemLabel}
                            dropDownDirection='BOTTOM'
                            zIndex={2}
                        />
                    </View>
                </View>

            </View>

            <View style={styles.chartContainer}>
                <View style={styles.chartTitle}>
                    <AppText 
                        text={'Dados do Refeitório'} 
                        textStyle={{
                            fontSize: 22,
                            textAlign: 'center',
                            fontFamily: appFonts.afacadReg,
                        }}
                    />
                </View>

                <View 
                    style={styles.chart}
                    onLayout={(event) => {
                        const { width } = event.nativeEvent.layout;
                        setContainerWidth(width);
                    }}
                >

                    <Barchart 
                        data={data} 
                        containerWidth={containerWidth}
                        screenHeight={screenHeight}
                        loading={loading}
                    />
                </View>
            </View>

            <View style={styles.bottomArea}>

                <View>

                </View>

                <View style={styles.pieChartContainer}>
                    <Piechart 
                        data={data} 
                        loading={loading}
                        containerWidth={0}
                        screenHeight={0} 
                    />
                </View>
            </View>

        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 16,
        paddingHorizontal: 10,
        gap: 10,
    },
    topBar: {
        width: '100%',
        height: '15%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '5%',
    },
    monthDropdownBar: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        color: '#000',
        borderWidth: 0,
        position: 'relative',
        overflow: 'hidden',
    },
    monthDropdownContainer: {
        width: '100%',
        backgroundColor: '#f7f7f7ff',
        borderWidth: 0,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        fontFamily: appFonts.afacadReg,
        boxShadow: appColors.shadow,
    },
    dropdownBar: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        color: '#000',
        borderWidth: 0,
        position: 'relative',
        overflow: 'hidden',
    },
    dropdownContainer: {
        width: '100%',
        backgroundColor: '#f7f7f7ff',
        borderWidth: 0,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        fontFamily: appFonts.afacadReg,
        boxShadow: appColors.shadow,
    },
    dropdownLabel: {
        paddingLeft: 5,
        fontSize: 16.5,
        color: '#000000ff',
        fontFamily: appFonts.afacadReg,
    },
    dropdownPlaceholder: {
        paddingLeft: 6,
        fontSize: 16,
        fontFamily: appFonts.afacadReg,
        color: '#000000',
    },
    selectedItemContainer: {
        backgroundColor: appColors.tertiary,
    },
    selectedItemLabel: {
        fontWeight: 'bold',
        color: '#000000ff',
    },
    chartContainer: {
        width: '100%',
        height: '50%',
        maxHeight: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        boxShadow: appColors.shadow,
        overflow: 'hidden',
    },
    chartTitle: {
        width: '55%',
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingTop: 10,
        borderBottomWidth: 0.6,
        borderBottomColor: appColors.primary,
    },
    chart: {
        width: '100%',
        minHeight: 320,
        maxHeight: 330,
        // boxShadow: appColors.shadow,
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '5%',
        paddingBottom: '5%',
    },
    bottomArea: {
        width: '100%',
        height: '32%',
        // backgroundColor: '#fff',
        maxHeight: '32%',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderRadius: 10,
        boxShadow: appColors.shadow,
        flexDirection: 'row',
    },
    pieChartContainer: {
        width: '50%',
        height: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        boxShadow: appColors.shadow,
    },
});

export default ManagmentScreen;
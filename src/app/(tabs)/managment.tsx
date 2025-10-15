import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useState } from 'react';
import Header from '@/src/components/layout/Header';
import Button from '@/src/components/ui/Button';

type ColaboratorType = {
    id: string;
    name: string;
};

interface ColaboratorProps {
    colaborator: ColaboratorType;
}

const ColaboratorCard = ({ colaborator }: ColaboratorProps) => (

    <View style={style.colaboratorCard}>
        <Text style={style.colId}>ID: {colaborator.id}</Text>
        <Text style={style.colName}>Nome: {colaborator.name.split(' ').slice(0, 2).join(' ')}</Text>
    </View>
);


const ManagmentScreen = () => {
    const [colaborators, setColaborators] = useState<ColaboratorType[]>([
        { id: '12355', name: 'Shaolin Matador de Porco' },
        { id: '22456', name: 'Luiz Henrique Araujo Farias' },
        { id: '31256', name: 'Rayan Ferreira de Souza Lima' },
    ]);

    return(
        <View style={{flex: 1}}>
            <Header title={'Gestão de fluxo'} subtitle={'IMREA'}/>
            
            <View style={style.container}>

                <View style={style.userPanel}>
                    
                    <View style={style.listTitle}>
                        <Text style={{fontSize: 22}}>Colaboradores</Text>
                    </View>

                    <FlatList 
                        data={colaborators}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <ColaboratorCard colaborator={item}/>}
                        contentContainerStyle={{ gap: 12 }}
                        style={style.list} />
                </View>

                <View style={style.actionContainer}>

                    <Button 
                        textButton={'Enviar dados'} 
                        onPress={() => null} 
                        style={null} 
                        disabled={false}/>

                    <Button 
                        textButton={'Buscar dados'} 
                        onPress={() => null} 
                        style={null} 
                        disabled={false}/>

                    <Button 
                        textButton={'Apagar dados'} 
                        onPress={() => null} 
                        style={null} 
                        disabled={false}/>
                </View>

            </View>
        </View>
    );

};

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#f4f4f4ff',
        padding: 24,
    },
    userPanel: {
        width: '100%',
        height: '60%',
        backgroundColor: '#fff',
        boxShadow: '0px 0px 8px #8a8a8a69',
        borderRadius: 4,
        alignItems: 'center',
        gap: 24,
        paddingBottom: 16
    },
    listTitle: {
        width: '70%',
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#95959569'
    },
    list: {
        width: '95%',
        height: 'auto',
    },
    colaboratorCard: {
        width: '100%',
        height: 'auto',
        padding: 8,
        backgroundColor: '#eaeaea78',
        borderRadius: 4
    },
    colId: {
        fontSize: 16
    },
    colName: {
        fontSize: 18
    },
    actionContainer: {
        width: '100%',
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default ManagmentScreen;
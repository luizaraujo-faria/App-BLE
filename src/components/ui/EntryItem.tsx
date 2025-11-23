import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

type EntryItemType = {
    id?: string;
    name?: string;
    sector?: string;
    entry?: string;
    exit?: string;
}

interface EntryItemProps {
    entryItem: EntryItemType;
    selectItem: (item: EntryItemType) => void;
}

const EntryItem = ({ entryItem, selectItem }: EntryItemProps) => {
    return (
        <TouchableOpacity onPress={() => selectItem(entryItem)}>
            <View style={styles.entryItemCard}>
                <View style={{ width: '50%', height: '100%', alignItems: 'flex-start', justifyContent: 'space-around' }}>
                    <Text style={styles.id}>ID: {entryItem.id}</Text>
                    {/* <Text>Nome: {entryItem.name?.split(' ', 2).join(' ')}</Text> */}
                </View>
                {/* <View style={{ width: '50%', height: '90%', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    <Text>{entryItem.entry}</Text>
                </View> */}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    entryItemCard: {
        width: '100%',
        height: 60,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#f8f8f8ff',
        boxShadow: '0px 0px 3px #7a7a7a81',
        padding: 5,
    },
    id: {
        fontSize: 18,
    },
});

export default EntryItem;
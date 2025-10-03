import { View, StyleSheet, Text } from 'react-native';

interface HeaderProps {
    title: string;
}

const Header = ({ title }: HeaderProps) => {

  return (
    <View style={styles.headerContainer}>

      <Text style={styles.headerTitle}>{title}</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 64,
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 24,
    boxShadow: '0px 1px 5px #5a5a5a69',
  },
  headerTitle: {
    fontSize: 24,
  },
});

export default Header;
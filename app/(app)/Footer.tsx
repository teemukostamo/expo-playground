import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

import theme from '../../theme';

type FooterIconProps = {
  text: string;
  href: string;
  icon: typeof FontAwesome.defaultProps.name;
};

const FooterIcon = ({ text, icon, href }: FooterIconProps) => {
  return (
    <View style={styles.iconContainer}>
      <Link href={href}>
        <View style={styles.iconContainer}>
          <FontAwesome name={icon} size={20} color='black' />
          <Text style={styles.iconText}>{text}</Text>
        </View>
      </Link>
    </View>
  );
};

export default function Footer() {
  return (
    <View style={styles.footer}>
      <FooterIcon icon='calendar' text='My Events' href='/my-events' />
      <FooterIcon icon='search' text='Find Events' href='/search' />
      <FooterIcon icon='user-circle' text='Profile' href='/user' />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 60,
    backgroundColor: theme.colors.darkgold,
    flexDirection: 'row',
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontFamily: 'regular',
    fontWeight: 'bold',
    fontSize: 12,
    padding: 3,
  },
});

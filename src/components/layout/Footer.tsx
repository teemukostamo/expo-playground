import { View, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { Link, usePathname } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import i18n from '../../i18n';
import theme from '../../../theme';

type FooterIconProps = {
  text: string;
  href: string;
  icon: typeof FontAwesome.defaultProps.name;
};

const FooterIcon = ({ text, icon, href }: FooterIconProps) => {
  const pathName = usePathname();
  const isActive = pathName.includes(href);
  const scale = useSharedValue(1);
  const underlineWidth = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    scale.value = withSpring(isActive ? 1.1 : 1);
    underlineWidth.value = withSpring(isActive ? 100 : 0);
  }, [isActive]);

  const animatedUnderlineStyle = useAnimatedStyle(() => {
    return {
      width: `${underlineWidth.value}%`, // Interpolate width
      height: 1, // Underline thickness
      backgroundColor: 'black', // Underline color
      bottom: 4, // Align to bottom
    };
  });

  return (
    <View style={styles.iconContainer}>
      <Link href={href}>
        <Animated.View style={[styles.iconContainer, animatedStyles]}>
          <FontAwesome name={icon} size={20} color='black' />
          <Text style={styles.iconText}>{text}</Text>
          <Animated.View style={[animatedUnderlineStyle]} />
        </Animated.View>
      </Link>
    </View>
  );
};

export default function Footer() {
  return (
    <View style={styles.footer}>
      <FooterIcon
        icon='calendar'
        text={i18n.t('footer.myEvents')}
        href='/my-events'
      />
      <FooterIcon
        icon='search'
        text={i18n.t('footer.findEvents')}
        href='/collections'
      />
      <FooterIcon
        icon='user-circle'
        text={i18n.t('footer.profile')}
        href='/user'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 55,
    backgroundColor: theme.colors.darkgold,
    flexDirection: 'row',
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
  },
  iconText: {
    fontFamily: 'regular',
    fontWeight: 'bold',
    fontSize: 12,
    padding: 3,
  },
});

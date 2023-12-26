import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { Link, router, usePathname } from 'expo-router';
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
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    scale.value = withSpring(isActive ? 1.1 : 1);
  }, [isActive]);

  return (
    <View style={styles.iconContainer}>
      <TouchableOpacity onPress={() => router.push(href)}>
        <Animated.View style={[styles.iconContainer, animatedStyles]}>
          <FontAwesome name={icon} size={20} color='black' />
          <Text style={[styles.iconText, isActive && styles.activeIconText]}>
            {text}
          </Text>
        </Animated.View>
      </TouchableOpacity>
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
    height: 50,
    backgroundColor: theme.colors.darkgold,
    flexDirection: 'row',
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  iconText: {
    fontFamily: 'regular',
    fontWeight: 'bold',
    fontSize: 12,
  },
  activeIconText: {
    backgroundColor: 'black',
    color: theme.colors.lightgold,
    marginTop: 2,
    borderRadius: 4,
    paddingHorizontal: 2,
  },
});

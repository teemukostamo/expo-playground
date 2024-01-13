import { View, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { AppContext } from '../../context/main';
import Login from '../../components/layout/Login';
import { Text, Stack, Theme, styled, Button, useTheme } from 'tamagui';
import { toggleThemeAction } from '../../context/layout';

export default function Page() {
  const { state, dispatch } = useContext(AppContext);
  const theme = useTheme();

  if (state.auth.token === null) {
    return (
      <View style={styles.container}>
        <Login />
      </View>
    );
  } else {
    return (
      <Theme name={state.layout.theme}>
        <Stack
          width='100%'
          backgroundColor='$background'
          flex={1}
          justifyContent='center'
          height='100%'
        >
          <Text
            alignSelf='center'
            color='$color'
            fontFamily='$heading'
            fontSize={30}
          >
            FOCUS ON THE FUN
          </Text>
          <Button
            onPress={() =>
              toggleThemeAction(
                dispatch,
                state.layout.theme === 'light' ? 'dark' : 'light'
              )
            }
          >
            Toggle theme
          </Button>
        </Stack>
      </Theme>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

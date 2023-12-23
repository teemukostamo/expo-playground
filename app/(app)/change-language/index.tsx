import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { changeLanguage } from '../../../src/i18n';
import { getData } from '../../../src/utils/AsyncStorageUtil';

import { AVAILABLE_LANGUAGES } from '../../../src/constants';
import { router } from 'expo-router';

const ChangeLanguage = () => {
  const [lang, setLang] = useState('');

  useEffect(() => {
    const getStoredLang = async () => {
      const storedLang = await getData('lang');
      if (storedLang) {
        setLang(storedLang);
      } else {
        setLang('en');
      }
    };
    getStoredLang();
  }, []);

  const handleLanguageChange = async (lang: string) => {
    await changeLanguage(lang);
    // todo change language context
    router.push('/user');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Selected Language: {lang}</Text>
      {AVAILABLE_LANGUAGES.map((lang) => (
        <Pressable onPress={() => handleLanguageChange(lang)} key={lang}>
          <View style={styles.changeLanguageButton}>
            <Text>{lang}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

export default ChangeLanguage;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
  },
  changeLanguageButton: {
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
  },
});

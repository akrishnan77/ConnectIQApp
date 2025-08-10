import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors } from '../theme';

export function Toolbar({ title, onBack, showBot = true, showBottomLine = true }:{ title?: string; onBack?: () => void; showBot?: boolean; showBottomLine?: boolean; }) {
  return (
    <View style={showBottomLine ? styles.containerWithBottomLine : styles.containerWithoutBottomLine}>
      <TouchableOpacity onPress={onBack}>
        <Image source={require('../../assets/images/home/icon_back.png')} style={styles.icon} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {showBot ? (
        <TouchableOpacity onPress={() => {}}>
          <Image source={require('../../assets/images/home/icon_bot_dark.png')} style={styles.icon} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerWithoutBottomLine: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: '#fff',
  },
  containerWithBottomLine: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    color: colors.text,
    marginStart: 16,
  },
  icon: { width: 24, height: 24 },
});

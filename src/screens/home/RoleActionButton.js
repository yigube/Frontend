import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RoleActionButton({
  styles,
  label,
  icon,
  iconColor = '#fff',
  backgroundColor,
  textColor,
  onPress,
  buttonStyles = [],
  rowStyles = [],
  textStyles = []
}) {
  return (
    <TouchableOpacity
      style={[styles.actionBtn, ...buttonStyles, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.btnRow, ...rowStyles]}>
        <Ionicons name={icon} size={18} color={iconColor} />
        <Text style={[styles.actionBtnText, ...textStyles, textColor ? { color: textColor } : null]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

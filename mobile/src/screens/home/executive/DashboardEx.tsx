import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Card } from '../../../ui/Card';
import { Toolbar } from '../../../ui/Toolbar';

export default function DashboardEx({ onViewTasks, showToolbar = true }: { onViewTasks: () => void; showToolbar?: boolean }) {
  return (
    <View style={{ flex: 1 }}>
      {showToolbar && <Toolbar title="Dashboard" />}
      <View style={{ padding: 16 }}>
        <Card>
          <View style={[styles.headerRow]}>
            <Image source={require('../../../../assets/images/home/icon_task_list.png')} style={styles.iconSmall} />
            <Text style={styles.headerTitle}>Associate's Tasks</Text>
          </View>
          <TouchableOpacity style={[styles.button, { marginLeft: 16, marginBottom: 16 }]} onPress={onViewTasks}>
            <Text style={styles.buttonText}>View</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#E0E0E0', flexDirection: 'row', alignItems: 'center' },
  iconSmall: { width: 24, height: 24, marginRight: 8 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#424242' },
  button: { borderWidth: 1, borderColor: '#5B57C7', borderRadius: 4, paddingVertical: 6, paddingHorizontal: 12, alignSelf: 'flex-start' },
  buttonText: { color: '#5B57C7', fontSize: 14, fontWeight: '500' },
});

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View, StyleSheet } from 'react-native';
import { Card } from '../../ui/Card';
import { Toolbar } from '../../ui/Toolbar';
import { getTrainingFiles } from '../../graph';

export default function Learning({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      try { setItems(await getTrainingFiles(token)); }
      catch (e: any) { setError(e?.message); }
      finally { setLoading(false); }
    })();
  }, [token]);
  return (
    <View style={{ flex: 1 }}>
      <Toolbar title="Learning" />
      <Card>
        <View style={styles.headerRow}>
          <Image source={require('../../../assets/images/home/icon_book.png')} style={styles.iconSmall} />
          <Text style={styles.headerTitle}>Weekly Training</Text>
          <View style={{ flex: 1 }} />
          <Text style={styles.headerCount}>{items.length}/5 Training</Text>
        </View>
      </Card>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : error ? (
        <Text style={{ color: 'red', margin: 16 }}>{error}</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <Card>
              <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
              </View>
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#E0E0E0', flexDirection: 'row', alignItems: 'center' },
  iconSmall: { width: 24, height: 24, marginRight: 8 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#424242' },
  headerCount: { fontSize: 14, color: '#424242' },
});

import React, { useState, useEffect } from 'react';
import { Button, Text, View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getUser, getTokenAsync, signOutAsync } from './src/auth';
import { getTodoTasks, getTrainingFiles, getTodoTaskById } from './src/graph';
import { Toolbar } from './src/ui/Toolbar';
import { Card } from './src/ui/Card';
import Dashboard from './src/screens/home/Dashboard';
import LandingGrid from './src/screens/home/LandingGrid';
import DashboardEx from './src/screens/home/executive/DashboardEx';
import ComingSoon from './src/screens/home/ComingSoon';
import TaskScreen from './src/screens/home/Task';
import Learning from './src/screens/home/Learning';
import { FloatingButtonAdd } from './src/ui/FloatingButton';
import { getData, saveData, KEY } from './src/utils/LocalStorage';
import { DEFAULT_USER_ROLE } from './src/utils/AppConstants';

type RootStackParamList = {
  Landing: undefined;
  Tabs: undefined;
  TaskDetails: { id: string; title?: string };
  ComingSoon: { title?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator();

function HomeScreen({ user, token, navigation, onSignOut }: { user: any; token: string; navigation: any; onSignOut?: () => void }) {
  const [role, setRole] = React.useState<string>(DEFAULT_USER_ROLE);
  useEffect(() => {
    (async () => {
      const v = await getData(KEY.USER_ROLE);
      if (v) {
        setRole(v);
      } else {
        // Seed storage with the resource-defined default on first run
        await saveData(KEY.USER_ROLE, DEFAULT_USER_ROLE);
      }
    })();
  }, []);
  // Role toggling via resource file (DEFAULT_USER_ROLE) or storage only; UI bot toggle removed
  if (role === 'Manager') {
    return (
      <DashboardEx
        token={token}
        onViewTasks={() => navigation.navigate('Tasks')}
        onOpenReports={() => navigation.navigate('ComingSoon', { title: 'Reports' })}
  onOpenTraining={() => navigation.navigate('Learning')}
  onSignOut={onSignOut}
      />
    );
  }
  return (
    <Dashboard
      token={token}
      onViewTasks={() => navigation.navigate('Tasks')}
  onSignOut={onSignOut}
    />
  );
}

function TasksScreen({ token, navigation }: { token: string; navigation: any }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const data = await getTodoTasks(token);
        setItems(data);
      } catch (e: any) { setError(e?.message); }
      finally { setLoading(false); }
    })();
  }, [token]);
  if (loading) return <ActivityIndicator style={{ marginTop: 24 }} />;
  if (error) return <Text style={styles.error}>{error}</Text>;
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('TaskDetails', { id: item.id, title: item.title })}>
            <Card>
              <View style={{ padding: 16 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
  <FloatingButtonAdd onPress={() => { /* Hook create task later */ }} />
    </View>
  );
}

function TrainingScreen({ token, navigation }: { token: string; navigation: any }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const data = await getTrainingFiles(token);
        setItems(data);
      } catch (e: any) { setError(e?.message); }
      finally { setLoading(false); }
    })();
  }, [token]);
  if (loading) return <ActivityIndicator style={{ marginTop: 24 }} />;
  if (error) return <Text style={styles.error}>{error}</Text>;
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Card>
            <View style={{ padding: 16 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

function TaskDetailsScreen({ route, token, navigation }: { route: any; token: string; navigation: any }) {
  const { id, title } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [checklist] = useState(
    [
      { id: '1', title: 'Check stock levels for new arrivals.', status: false },
      { id: '2', title: 'Update promotional displays.', status: false },
      { id: '3', title: 'Clear out old signage.', status: false },
    ]
  );
  useEffect(() => {
    (async () => {
      try {
        const data = await getTodoTaskById(token, id);
        setTask(data);
      } catch (e: any) {
        setError(e?.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);
  const getPriorityText = (importance?: string) => importance === 'high' ? 'High' : importance === 'low' ? 'Low' : 'Medium';
  const getStatusText = (status?: string) => status === 'inProgress' ? 'In Progress' : status === 'completed' ? 'Completed' : 'Not Started';
  const getStatusColor = (status?: string) => status === 'completed' ? '#0E700E' : status === 'inProgress' ? '#BC4B09' : '#616161';
  const formatDueDate = (due?: any) => (due?.dateTime ? new Date(due.dateTime).toLocaleDateString() : 'No due date');
  return (
    <View style={{ flex: 1 }}>
  <Toolbar title={title || 'Task Details'} onBack={() => navigation.goBack()} />
      <View style={{ padding: 16 }}>
        {loading ? (
          <ActivityIndicator />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : task ? (
          <>
            <Card>
              <View style={{ padding: 16 }}>
                <View style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#242424' }}>{task.title}</Text>
                    <Image source={require('./src/assets/images/task/icon_task_title.png')} style={{ width: 20, height: 20 }} />
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
                    <Text style={{ color: getStatusColor(task.status), marginRight: 12, fontWeight: '500' }}>{getStatusText(task.status)}</Text>
                    <View style={{ paddingVertical: 2, paddingHorizontal: 8, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0' }}>
                      <Text style={{ fontSize: 12, color: '#424242' }}>{getPriorityText(task.importance)}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ height: 1, backgroundColor: '#E0E0E0', marginVertical: 8 }} />
                {showMore && (
                  <>
                    <View style={{ marginBottom: 12 }}>
                      <Text style={{ fontSize: 13, color: '#757575' }}>Due By</Text>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#212121', marginTop: 4 }}>{formatDueDate(task.dueDateTime)}</Text>
                    </View>
                    {!!(task.categories || []).length && (
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ fontSize: 13, color: '#757575' }}>Category</Text>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#212121', marginTop: 4 }}>{(task.categories || []).join(', ')}</Text>
                      </View>
                    )}
                  </>
                )}
                <View style={{ alignItems: 'center', marginTop: 8 }}>
                  <TouchableOpacity onPress={() => setShowMore(!showMore)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={showMore ? require('./src/assets/images/task/icon_viewless.png') : require('./src/assets/images/task/icon_viewmore.png')} style={{ width: 16, height: 16, marginRight: 8 }} />
                    <Text style={{ color: '#5B57C7', fontWeight: '500' }}>{showMore ? 'View Less' : 'View More'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
            {/* Checklist */}
            <Card>
              <View style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#242424' }}>Checklist</Text>
                  <Text style={{ fontSize: 14, color: '#616161' }}>1/{checklist.length} Completed</Text>
                </View>
                <View style={{ height: 8 }} />
                {checklist.map(item => (
                  <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EEE' }}>
                    <Image source={item.status ? require('./src/assets/images/task/icon_green_check.png') : require('./src/assets/images/task/icon_grey_check.png')} style={{ width: 20, height: 20, marginRight: 12 }} />
                    <Text style={{ fontSize: 16, color: '#242424', flex: 1 }}>{item.title}</Text>
                  </View>
                ))}
              </View>
            </Card>
          </>
        ) : (
          <Text>No details found.</Text>
        )}
      </View>
    </View>
  );
}

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setError(null);
    try {
      const tok = await getTokenAsync();
      setToken(tok);
      const me = await getUser(tok);
      setUser(me);
    } catch (e: any) {
      setError(e?.message || 'Sign-in failed');
    }
  };

  const handleSignOut = async () => {
    await signOutAsync();
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>ConnectIQ Mobile</Text>
        <Button title="Sign in with Microsoft" onPress={handleSignIn} />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing">
          {({ navigation: nav }: any) => (
            <LandingGrid
              userName={user?.displayName}
              onSelect={(index: number, title: string) => {
                if (index === 0) {
                  // Workforce Management -> enter tabbed app
                  nav.navigate('Tabs');
                } else {
                  nav.navigate('ComingSoon', { title });
                }
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Tabs">
          {() => (
            <Tabs.Navigator
              screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#E0E0FF',
                tabBarStyle: { backgroundColor: '#5B57C7', borderTopWidth: 0 },
              }}
            >
              <Tabs.Screen
                name="Dashboard"
                options={{
                  tabBarLabel: 'Dashboard',
                }}
              >
                {(props: any) => (
                  <HomeScreen user={user} token={token} navigation={props.navigation} onSignOut={handleSignOut} />
                )}
              </Tabs.Screen>
              <Tabs.Screen
                name="Tasks"
                options={{ tabBarLabel: 'Tasks' }}
              >
                {(props: any) => <TaskScreen token={token} onOpenTask={(id: string, title?: string) => props.navigation.navigate('TaskDetails', { id, title })} onSignOut={handleSignOut} />}
              </Tabs.Screen>
              <Tabs.Screen
                name="Learning"
                options={{ tabBarLabel: 'Learning' }}
              >
                {(props: any) => <Learning token={token} navigation={props.navigation} onSignOut={handleSignOut} />}
              </Tabs.Screen>
            </Tabs.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen name="TaskDetails">
          {(props: any) => <TaskDetailsScreen {...props} token={token} />}
        </Stack.Screen>
  <Stack.Screen name="ComingSoon" component={ComingSoon} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  subtitle: { fontSize: 16, marginVertical: 12 },
  error: { color: 'red', marginTop: 12 },
  card: { padding: 16, borderRadius: 8, backgroundColor: '#f1f1f1', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600' }
});

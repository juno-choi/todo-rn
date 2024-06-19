import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { theme } from './color';
import { useEffect, useState } from 'react';
import AsnyncStorage from '@react-native-async-storage/async-storage';
import { Octicons } from '@expo/vector-icons';

export default function App() {
  const [working, setWorking] = useState("work");
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const STORAGE_KEY = "@toDos";

  useEffect(() => {
    loadToDos();
  }, []);
  
  const travel = () => setWorking("travel");
  const work = () => setWorking("work");
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    await AsnyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }
  const loadToDos = async() => {
    const item = await AsnyncStorage.getItem(STORAGE_KEY);
    const parseItem = JSON.parse(item);
    setToDos(parseItem);
  }

  const addToDo = async () => {
    if (text === '') {
      return;
    }

    // todo save
    // const newToDos = Object.assign({}, toDos, {[Date.now()]:{text, type: working}});
    const newToDos = {...toDos, [Date.now()]:{text, type: working}};
    setToDos(newToDos);
    await saveToDos(newToDos);

    setText("");
  }
  
  const deleteToDo = async (key) => {
    Alert.alert("삭제", "정말로 삭제하시겠어요?", [
      {text: "취소", style: "cancel"},
      {text: "삭제", onPress: async () => {
        const newToDos = {...toDos};
        delete newToDos[key];
        setToDos(newToDos);
        await saveToDos(newToDos);
      }}
    ])
    return;
  }
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.buttonText, color: working === "work" ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.buttonText, color: working === "travel" ? "white" : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput 
          onSubmitEditing={addToDo} 
          onChangeText={onChangeText} 
          returnKeyType='done'
          value={text} 
          placeholder={working === 'work' ? '무엇을 하고 싶나요?' : working === 'travel' ? '어디를 가고 싶나요?' : ''} 
          style={styles.input}>
        </TextInput>
        <ScrollView>{
          Object.keys(toDos).filter(f => toDos[f].type === working).map(key => 
          <View key={key} style={styles.toDo}>
            <Text style={styles.toDoText}>{toDos[key].text}</Text>
            <TouchableOpacity onPress={() => deleteToDo(key)}><Text><Octicons name="trash" size={24} color="white" /></Text></TouchableOpacity>
          </View>)  
        }</ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  buttonText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 18,
    marginVertical: 20,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

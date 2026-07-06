import React, { useMemo, useState } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Fuse from "fuse.js";
import { searchData } from "./Utils/searchData";

export default function SearchScreen({ navigation }: any) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => {
    return new Fuse(searchData, {
      keys: [
        { name: "title", weight: 0.4 },
        { name: "keywords", weight: 0.4 },
        { name: "content", weight: 0.2 },
      ],
      threshold: 0.4,
      ignoreLocation: true,
      includeScore: true,
    });
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    return fuse.search(query).map((result) => result.item);
  }, [query, fuse]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search..."
        placeholderTextColor="#999"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.screen}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.result}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.preview} numberOfLines={2}>
              {item.content.trim()}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
  },
  input: {
    marginTop: 50,
    backgroundColor: "#111",
    color: "white",
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#6dab51",
  },
  result: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  preview: {
    color: "#aaa",
    marginTop: 4,
    fontSize: 14,
  },
});
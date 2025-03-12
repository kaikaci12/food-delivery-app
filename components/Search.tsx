import React from "react";
import { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
interface SearchProps {
  handleSearch: (searchTerm: string) => void;
}
const Search = ({ handleSearch }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <View style={styles.container}>
      <FontAwesome
        name="search"
        size={20}
        color="#A0A0A0"
        style={styles.icon}
      />
      <TextInput
        onChangeText={setSearchTerm}
        value={searchTerm}
        style={styles.input}
        placeholder="Search dishes, restaurants"
        placeholderTextColor="#A0A0A0"
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginBottom: 32,
  },
  icon: {
    marginLeft: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 22,
    paddingHorizontal: 15,
  },
});

import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native";
interface CategoryProps {
  handleCategory: (categoryName: string) => void;
  setActive: (categoryName: string) => void;
  active: string;
}
const Categories = ({ handleCategory, active, setActive }: CategoryProps) => {
  const [categories, setCategories] = useState([
    { name: "All", image: require("../assets/categories/fire.png") },
    {
      name: "Deserts",
      image: require("../assets/categories/dessert.png"),
    },
    {
      name: "Burgers",
      image: require("../assets/categories/icons8-hamburger-96.png"),
    },
    {
      name: "Pizza",
      image: require("../assets/categories/icons8-pizza-96.png"),
    },
  ]);

  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={styles.title}>All Categories</Text>
      <ScrollView horizontal>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.categoryItem,
              active === category.name && styles.activeCategory,
            ]}
            onPress={() => handleCategory(category.name)}
          >
            <Image source={category.image} style={styles.categoryImage} />
            <Text
              style={[
                styles.categoryText,
                active === category.name && styles.activeText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  activeCategory: {
    backgroundColor: "#FFA500", // Smooth orange gradient for active category
    shadowColor: "#FFA500",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  categoryImage: {
    width: 50,
    height: 50,
    marginRight: 16,
    borderRadius: 25,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#555",
  },
  activeText: {
    color: "#fff", // White text color for active category
    fontWeight: "600",
  },
});

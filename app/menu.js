import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  StyleSheet,
  ImageBackground,
  Switch,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
const { width, height } = Dimensions.get("window");


const menu = () => {
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [tableInfo, setTableInfo] = useState(null);
  const [hotelInfo, setHotelInfo] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  //   const router = useRouter(); // Use Expo Router for navigation
  const [isACEnabled, setIsACEnabled] = useState(true);
  const [isGSTEnabled, setIsGSTEnabled] = useState(true);
  const [isVATEnabled, setIsVATEnabled] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [tastes, setTastes] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedTastes, setSelectedTastes] = useState({});
  const [newTastes, setNewTastes] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [sections, setSections] = useState([]);
  const [sectionId, setSectionId] = useState(null); // New state for sectionId
  const [showCategoryMenus, setShowCategoryMenus] = useState(true);
  const [waiterName, setWaiterName] = useState("");
  const [waitersList, setWaitersList] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [greetings, setGreetings] = useState([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false); // State to manage category modal
  const [showCancelQtyInput, setShowCancelQtyInput] = useState(false); // Track Cancel-KOT click
  const [captain, setCaptain] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [menuStates, setMenuStates] = useState({}); // To track increments and bg colors

const [selectedMenuId, setSelectedMenuId] = useState(null); // State to track selected menu
const [selectedProductId, setSelectedProductId] = useState(null); // Track selected product
  const [quantities, setQuantities] = useState({}); // Track quantities for all products
  const router = useRouter(); // Hook to manage routing



  useEffect(() => {
      axios
        .get(`http://192.168.0.109:5000/api/main/hide`)
        .then((response) => {
          setCategories(response.data);
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
        });

      // Fetch products
      axios
        .get(`http://192.168.0.109:5000/api/menu/menus/list`)
        .then((response) => {
          const menusArray = response.data; // Ensure menus is an array
          setMenus(menusArray);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    
  }, []);



  const filterMenus = (menu) => {
    const searchTerm = searchInput.toLowerCase().trim();

    // If the search term is empty, show all menus
    if (searchTerm === "") {
      return true;
    }

    // Check if the search term is a number
    const searchTermIsNumber = !isNaN(searchTerm);

    // If the search term is a number, filter based on menu's uniqueId
    if (searchTermIsNumber) {
      return menu.uniqueId === searchTerm;
    }

    // Split the search term into words
    const searchLetters = searchTerm.split("");

    // Check if the first letters of both words match the beginning of words in the menu's name
    const firstAlphabetsMatch = searchLetters.every((letter, index) => {
      const words = menu.name.toLowerCase().split(" ");
      const firstAlphabets = words.map((word) => word[0]);
      return firstAlphabets[index] === letter;
    });

    // Check if the full search term is included in the menu's name
    const fullWordIncluded = menu.name.toLowerCase().includes(searchTerm);

    return firstAlphabetsMatch || fullWordIncluded;
  };

 useEffect(() => {
    const initialMenuStates = {};
    (menus.menus || menus).forEach((product) => {
      initialMenuStates[product._id] = { count: 0, bgColor: "white" };
    });
    setMenuStates(initialMenuStates);
  }, [menus]);

  const handleProductTap = (productId) => {
    setSelectedMenuId(productId); // Set the selected menu ID
    setMenuStates((prevState) => {
      const currentState = prevState[productId] || { count: 0, bgColor: "white" };
      return {
        ...prevState,
        [productId]: {
          count: currentState.count + 1,
          bgColor: currentState.bgColor = "#d3f9d8" // Update background color for selection
        },
      };
    });

  
  };

  const navigateToBillOrder = () => {
    // Filter the menuStates to find products with a count greater than 0
    const selectedMenus = Object.keys(menuStates)
      .filter((menuId) => menuStates[menuId].count > 0) // Find menus with a count > 0
      .map((menuId) => {
        // Find the corresponding product from the menus array using the menuId
        const product = (menus.menus || menus).find((product) => product._id === menuId);
        if (product) {
          return { ...product, count: menuStates[menuId].count }; // Add count to the product data
        }
      })
      .filter((product) => product); // Remove any undefined products if not found
  
    // Log the selected menu data to the console
    if (selectedMenus.length > 0) {
      console.log("Selected Menus: ", selectedMenus);
    } else {
      console.log("No menus selected");
    }
  
    // Pass the selected menus with count to the BillOrder page
    router.push({
      pathname: '/order/billOrder',
      query: { selectedMenus: JSON.stringify(selectedMenus) }, // Pass as query params (as string)
    });
  };
  
  
  return (
    <View style={{ paddingHorizontal: 10, backgroundColor: "#fff" }}>
      <View style={{ paddingHorizontal: 2, marginTop: "5%" }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "black",
            textAlign: "left",
            marginLeft: "2%",
            marginBottom: "3%",
          }}
        >
          All Menu
        </Text>
        {selectedMenuId && (
          <TouchableOpacity
            onPress={navigateToBillOrder}
            style={{
              position: "absolute",
              top: 5,
              right: 5,
            }}
          >
            <FontAwesome
              name="arrow-right"
              size={20}
              color="#3498db"
            />
          </TouchableOpacity>
        )}
        <TextInput
          value={searchInput}
          onChangeText={setSearchInput}
          placeholder="Search Menu / Id..."
          style={{
            paddingHorizontal: 8,
            paddingVertical: 10,
            borderColor: "gray",
            borderWidth: 2,
            borderRadius: 4,
            marginTop: "2%",
            fontSize: 12,
            width: "35%",
            marginLeft: 5,
          }}
        />
      </View>
      <ScrollView style={{ marginTop: "5%" }}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {(menus.menus || menus)
            .filter(filterMenus)
            .map((product) => (
              <TouchableOpacity
                key={product._id}
                onPress={() => handleProductTap(product._id)}
                style={{
                  width: "32%",
                  padding: 8,
                  marginBottom: 8,
                  backgroundColor:
                    menuStates[product._id]?.bgColor || "white",
                  borderColor: "#ccc",
                  borderWidth: 1,
                  borderRadius: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#f39c12",
                      fontWeight: "bold",
                    }}
                  >
                    {product.uniqueId}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#27ae60",
                      fontWeight: "bold",
                    }}
                  >
                    ₹{product.price}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "#333",
                      marginTop: 35,
                    }}
                  >
                    {product.name}
                  </Text>
                  {product.stockQty > 0 && (
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "#e67e22",
                        paddingHorizontal: 6,
                        borderRadius: 8,
                      }}
                    >
                      Q: {product.stockQty}
                    </Text>
                  )}
                </View>
                <Text
                  style={{
                    marginTop: 10,
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {menuStates[product._id]?.count > 0 &&
                    `Count: ${menuStates[product._id]?.count}`}
                </Text>
                {/* Render Arrow Icon if Selected */}
               
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default menu;

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Platform
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { Image } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import Icon from "react-native-vector-icons/MaterialIcons";
const { width, height } = Dimensions.get("window");

const BillOrder = ({ tableId, acPercentage }) => {
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [tableInfo, setTableInfo] = useState(null);
  const [hotelInfo, setHotelInfo] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter(); // Use Expo Router for navigation
  const [isACEnabled, setIsACEnabled] = useState(true);
  const [isGSTEnabled, setIsGSTEnabled] = useState(true);
  const [isVATEnabled, setIsVATEnabled] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedProduct, setFocusedProduct] = useState(null);
  const [tappedProducts, setTappedProducts] = useState([]);
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
  const [customerCount, setCustomerCount] = useState(""); // State for customer count
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [greetings, setGreetings] = useState([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false); // State to manage category modal
  const [showCancelQtyInput, setShowCancelQtyInput] = useState(false); // Track Cancel-KOT click
  const [captain, setCaptain] = useState("");
  const [isKotBtn, setIsKotBtn] = useState(false);
  const [isPrintBtn, setIsPrintBtn] = useState(false);
  const [tapCounts, setTapCounts] = useState({}); // Track counts for each product
  const [quantitiesToCancel, setQuantitiesToCancel] = useState({});
  const [selectedMenuNames, setSelectedMenuNames] = useState([]);
  const [existingItems, setExistingItems] = useState([]); // To store existing items

  // const [language, setLanguage] = useState(
  //   AsyncStorage.getItem("language") || "en"
  // ); // Default to 'en' if no language is set

  // const handleLanguageChange = (selectedLanguage) => {
  //   setLanguage(selectedLanguage);
  //   AsyncStorage.setItem("language", selectedLanguage); // Save the selected language in localStorage
  // };

  const [language, setLanguage] = useState("en");

  // Load the language setting from AsyncStorage on initial load
  // useEffect(() => {
  //   const loadLanguage = async () => {
  //     const savedLanguage = await AsyncStorage.getItem('language');
  //     if (savedLanguage) {
  //       setLanguage(savedLanguage);
  //     }
  //   };
  //   loadLanguage();
  // }, []);

  // const handleLanguageChange = async (selectedLanguage) => {
  //   // Update the state and AsyncStorage for the selected language
  //   setLanguage(selectedLanguage);
  //   await AsyncStorage.setItem('language', selectedLanguage);

  //   // Remove the opposite language from AsyncStorage
  //   if (selectedLanguage === 'en') {
  //     await AsyncStorage.removeItem('mr'); // Remove Marathi language key if switching to English
  //   } else if (selectedLanguage === 'mr') {
  //     await AsyncStorage.removeItem('en'); // Remove English language key if switching to Marathi
  //   }
  // };

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem("language");
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    };
    loadLanguage();
  }, []);

  const handleLanguageChange = async (selectedLanguage) => {
    setLanguage(selectedLanguage); // Set language immediately
    await AsyncStorage.setItem("language", selectedLanguage); // Save the selected language in AsyncStorage
  };

  const handleNamePress = (productId) => {
    // Update the focused product
    setFocusedProduct(productId);

    // Increment the count for the tapped product
    setTapCounts((prevCounts) => ({
      ...prevCounts,
      [productId]: (prevCounts[productId] || 0) + 1,
    }));
  };

  //Toast.setRef(ref => Toast.ref = ref);
  const toggleKotBtn = () => {
    setIsKotBtn((prevState) => !prevState); // Toggle the current state
  };

  const togglePrintBtn = () => {
    setIsPrintBtn((prevState) => !prevState); // Toggle the current state
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("@token");
    await AsyncStorage.removeItem("userName");
    await AsyncStorage.removeItem("role");
    await AsyncStorage.removeItem("waiter");
    await AsyncStorage.removeItem("admin");
    await AsyncStorage.removeItem("captain");
    await GoogleSignin.signOut(); // Clear Google Sign-In session

    router.push("/"); // Navigate to home on confirmation
  };

  const handleToggle = () => {
    setShowCancelQtyInput((prev) => !prev); // Toggle visibility
  };

  const handleCategoryModalToggle = () => {
    setCategoryModalOpen(!categoryModalOpen);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
    // setShowCategoryMenus(!showCategoryMenus);
    // setShowBarCategoryMenus(!showBarCategoryMenus);
    setShowCategoryMenus(true); // Show menus immediately when modal opens
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = await AsyncStorage.getItem("EmployeeAuthToken");
      if (token) {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("waiterName");
        console.log("storedUsername", storedUsername);
        if (storedUsername) {
          setCaptain(storedUsername);
        }
      } catch (error) {
        console.error("Error fetching username from AsyncStorage:", error);
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    const fetchTastes = async () => {
      try {
        const response = await axios.get(
          `http://192.168.0.109:5000/api/taste/tastes`
        );
        setTastes(response.data);
        if (response.data.length > 0) {
          setSelectedOption(response.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching tastes:", error);
      }
    };
    fetchTastes();
  }, []);

  const handleSelectChange = (orderId, tasteId) => {
    setSelectedTastes((prevSelectedTastes) => ({
      ...prevSelectedTastes,
      [orderId]: tasteId,
    }));

    console.log("taste", tasteId);
  };

  const handleNewTasteChange = (orderId, newTaste) => {
    setNewTastes((prevNewTastes) => ({
      ...prevNewTastes,
      [orderId]: newTaste,
    }));
  };

  const modifiedCurrentOrder = currentOrder.map((orderItem) => {
    const selectedTasteId = selectedTastes[orderItem._id];
    const selectedTaste =
      selectedTasteId === "other"
        ? { _id: "other", taste: newTastes[orderItem._id] || "" }
        : tastes.find((taste) => taste.taste === selectedTasteId) || {
            _id: null,
            taste: selectedTasteId,
          };

    return { ...orderItem, selectedTaste };
  });

  const fetchWaitersList = async () => {
    try {
      const response = await axios.get(`http://192.168.0.109:5000/api/waiter`);
      setWaitersList(response.data);
    } catch (error) {
      console.error("Error fetching waiters list:", error.message);
    }
  };

  useEffect(() => {
    fetchWaitersList();
  }, []);

  const fetchGreetings = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.109:5000/api/greet/greet`
      );
      setGreetings(response.data);
    } catch (error) {
      console.error("Error fetching greetings:", error);
    }
  };

  useEffect(() => {
    fetchGreetings();
  }, []);

  const fetchNextOrderNumber = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.109:5000/api/order/get-next-order-number`
      );
      setOrderNumber(response.data.nextOrderNumber);
    } catch (error) {
      console.error("Error fetching next order number:", error);
    }
  };

  useEffect(() => {
    fetchNextOrderNumber();
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

  const updateOrder = (updatedOrderItem) => {
    setCurrentOrder((prevOrder) => {
      const updatedOrder = prevOrder.map((item) =>
        item.name === updatedOrderItem.name ? updatedOrderItem : item
      );
      // console.log(updatedOrder); // Log the updated order
      return updatedOrder;
    });
  };

  // const handleQuantityChange = (e, orderItem) => {
  //   let newQuantity = e.target.value;

  //   // Handle backspace
  //   if (e.nativeEvent.inputType === "deleteContentBackward") {
  //     newQuantity = newQuantity.slice(0, -1);
  //   }

  //   if (newQuantity === "" || isNaN(newQuantity) || newQuantity < 0) {
  //     newQuantity = "";
  //   } else {
  //     newQuantity = parseInt(newQuantity, 10);
  //   }

  //   const updatedOrderItem = { ...orderItem, quantity: newQuantity };
  //   // console.log(updatedOrderItem);
  //   updateOrder(updatedOrderItem);
  // };

  useEffect(() => {
    setCurrentOrder((prevOrder) => [...prevOrder]); // Trigger a re-render
  }, [isACEnabled]);

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
        const updatedMenus = response.data.map((menu) => ({
          ...menu,
          name: language === "mr" ? menu.nameMarathi : menu.name,
        }));
        setMenus(updatedMenus);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [language]);

  useEffect(() => {
    if (tableId) {
      axios
        .get(`http://192.168.0.109:5000/api/table/tables/${tableId}`)
        .then((response) => {
          setTableInfo(response.data);

          // Fetch saved bills for the table from the API
          axios
            .get(`http://192.168.0.109:5000/api/order/savedBills/${tableId}`)
            .then((response) => {
              const savedBills = response.data;
              if (savedBills.length > 0) {
                // Assuming you want to load the latest saved bill
                const latestOrder = savedBills[savedBills.length - 1];
                setCurrentOrder(latestOrder.items || []); // Initialize currentOrder with the saved items
                setWaiterName(latestOrder.waiterName);
              }
            })
            .catch((error) => {
              console.error("Error fetching saved bills:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching table information:", error);
        });
    }
  }, [tableId]);

  useEffect(() => {
    // Fetch menus based on the selected category
    if (selectedCategory) {
      axios
        .get(`http://192.168.0.109:5000/api/menu/${selectedCategory._id}`)
        .then((response) => {
          // console.log(response.data);
          const menusArray = response.data || []; // Ensure menus is an array
          setMenus(menusArray);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    }
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowCategoryMenus(true); // Set this to true to ensure category menus are shown
    handleCategoryModalToggle();
    // If the category is null (All items), fetch all menus
    if (category === null) {
      axios
        .get(`http://192.168.0.109:5000/api/menu/menus/list`)
        .then((response) => {
          const updatedMenus = response.data.map((menu) => ({
            ...menu,
            name: language === "mr" ? menu.nameMarathi : menu.name,
          }));
          setMenus(updatedMenus);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    } else {
      // Fetch menus based on the selected category
      axios
        .get(`http://192.168.0.109:5000/api/menu/menulist/${category._id}`)
        .then((response) => {
          // console.log(response.data);
          setMenus(response.data);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    }
  };

  const calculateTotal = () => {
    const itemsWithBarCategory = currentOrder.filter(
      (orderItem) => orderItem.barCategory
    );
    const itemsWithoutBarCategory = currentOrder.filter(
      (orderItem) => !orderItem.barCategory
    );

    // Calculate subtotal for items with barCategory and items without barCategory separately
    const subtotalWithBarCategory = itemsWithBarCategory.reduce(
      (acc, orderItem) => {
        const price = orderItem.price
          ? orderItem.price
          : orderItem.pricePer[`pricePer${orderItem.barCategory}`];
        return acc + price * orderItem.quantity;
      },
      0
    );

    const subtotalWithoutBarCategory = itemsWithoutBarCategory.reduce(
      (acc, orderItem) => {
        const price = orderItem.price
          ? orderItem.price
          : orderItem.pricePer[`pricePer${orderItem.barCategory}`];
        return acc + price * orderItem.quantity;
      },
      0
    );

    // Calculate VAT for items with barCategory
    const VATRate = isVATEnabled ? vatPercentage / 100 : 0; // Use VAT percentage if enabled
    const VAT = VATRate * subtotalWithBarCategory;

    // Calculate GST for items without barCategory
    const GSTRate = isGSTEnabled ? gstPercentage / 100 : 0; // Use GST percentage if enabled
    const CGST = (GSTRate / 2) * subtotalWithoutBarCategory; // Half of the GST for CGST
    const SGST = (GSTRate / 2) * subtotalWithoutBarCategory; // Half of the GST for SGST

    // Include acPercentage in the total calculation
    const acPercentageAmount = isACEnabled
      ? (subtotalWithBarCategory + subtotalWithoutBarCategory) *
        (acPercentage / 100)
      : 0;

    const menuTotal = subtotalWithoutBarCategory + CGST + SGST;
    const total = subtotalWithBarCategory + VAT;
    const grandTotal = menuTotal + total + acPercentageAmount;

    const totalQuantity = currentOrder.reduce(
      (acc, orderItem) => acc + orderItem.quantity,
      0
    );

    return {
      subtotal: subtotalWithoutBarCategory.toFixed(2),
      barSubtotal: subtotalWithBarCategory.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      VAT: VAT.toFixed(2),
      SGST: SGST.toFixed(2),
      CGST: CGST.toFixed(2),
      acPercentageAmount: acPercentageAmount.toFixed(2), // AC percentage amount based on subtotal
      total: total.toFixed(2),
      menuTotal: menuTotal.toFixed(2),
      totalQuantity: totalQuantity,
    };
  };

  const [gstPercentage, setGSTPercentage] = useState(0); // Add this line for the GST percentage
  const [vatPercentage, setVATPercentage] = useState(0); // Add this line for the GST percentage

  useEffect(() => {
    const fetchHotelInfo = async () => {
      try {
        // Fetch all hotels
        const allHotelsResponse = await axios.get(
          `http://192.168.0.109:5000/api/hotel/get-all`
        );
        const allHotels = allHotelsResponse.data;

        // Assuming you want to use the first hotel's ID (you can modify this logic)
        const defaultHotelId = allHotels.length > 0 ? allHotels[0]._id : null;

        if (defaultHotelId) {
          // Fetch information for the first hotel
          const response = await axios.get(
            `http://192.168.0.109:5000/api/hotel/get/${defaultHotelId}`
          );
          const hotelInfo = response.data;
          // console.log(hotelInfo);
          setHotelInfo(hotelInfo);
          setGSTPercentage(hotelInfo.gstPercentage || 0);
          setVATPercentage(hotelInfo.vatPercentage || 0);
        } else {
          console.error("No hotels found.");
        }
      } catch (error) {
        console.error("Error fetching hotel information:", error);
      }
    };

    fetchHotelInfo();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const [ProductName, setProductName] = useState("");

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const sectionsResponse = await axios.get(
          `http://192.168.0.109:5000/api/section`
        );
        setSections(sectionsResponse.data);

        // Set the sectionId from the first section if not already set
        if (sectionsResponse.data.length > 0 && !sectionId) {
          setSectionId(sectionsResponse.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    fetchSections();
  }, []);

  const home = () => {
    //router.push("/");
    Alert.alert(
      "Confirm Logout",
      "Do you really want to exit?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            router.push("/"); // Navigate to home on confirmation
          },
        },
      ],
      { cancelable: true }
    );
  };
  const generateOrderContent = (items, tableInfo, title) => {
    // Define the total width for each line (adjust as needed)
    const lineWidth = 40; // Adjust this for the maximum width

    // ESC/POS Printer formatting commands
    const ESC = "\x1B"; // ESC character
    const BOLD_ON = `${ESC}E1`; // Bold text ON
    const BOLD_OFF = `${ESC}E0`; // Bold text OFF
    const CENTER = `${ESC}a1`; // Center alignment

    // Center a line of text by adding spaces before it
    const centerText = (text) => {
      const padding = Math.floor((lineWidth - text.length) / 2);
      return " ".repeat(padding > 0 ? padding : 0) + text;
    };

    // Add two items on the same line with spacing
    const formatTwoColumns = (left, right, maxWidth = lineWidth) => {
      const leftText = left.padEnd(Math.floor(maxWidth / 2), " ");
      const rightText = right.padStart(maxWidth - leftText.length, " ");
      return leftText + rightText;
    };

    // Check if any item has a `taste` defined
    const hasTaste = items.some((item) => item.taste);

    // Get current date and time
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const currentDate = `${day}/${month}/${year}`;
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const currentTime = `${formattedHours
      .toString()
      .padStart(2, "0")}:${minutes} ${period}`;

    // Start building the content with all text bold
    let content = `${BOLD_ON}`; // Turn bold ON
    content += `${CENTER}${title}\n\n`; // Centered title
    content += `${formatTwoColumns(`Waiter: ${captain}`, "")}\n`; // Align Waiter to the left
    content += `${formatTwoColumns(
      `Section: ${tableInfo.section.name}`,
      `Table: ${tableInfo.tableName}`
    )}\n`;
    content += `${formatTwoColumns(
      `Date: ${currentDate}`,
      `Time: ${currentTime}`
    )}\n`;
    content += `${centerText("---------------------------------------")}\n`;

    // Adjust labels
    let labelLine = "Item".padEnd(22); // Reduced padding for Item
    if (hasTaste) {
      labelLine += "Taste".padEnd(10);
    }
    labelLine += "Qty".padStart(5);
    content += `${labelLine}\n`;
    content += `${centerText("---------------------------------------")}\n`;

    items.forEach((item) => {
      const lineMaxLength = 19; // Max width for item names
      const itemName = item.name;
      const taste = item.taste ? item.taste.padEnd(10) : "".padEnd(10);
      const quantityText = item.quantity.toString().padStart(5);

      // First line with Item Name
      const firstLine = itemName.slice(0, lineMaxLength);
      let itemLine = `${firstLine.padEnd(22)}`;
      if (hasTaste) {
        itemLine += taste;
      }
      itemLine += quantityText;
      content += `${itemLine}\n`;

      // Print remaining text directly under "Item" label
      const remainingText = itemName.slice(lineMaxLength);
      let offset = 0;
      while (offset < remainingText.length) {
        const nextLine = remainingText.slice(offset, offset + lineMaxLength);
        content += `${nextLine.padEnd(17)}\n`; // Align with the start of Item label
        offset += lineMaxLength;
      }
    });

    content += `${centerText("---------------------------------------")}\n`;
    content += `${BOLD_OFF}`; // Turn bold OFF at the end

    return content;
  };
  // Give KOT function

  const reKot = async () => {
    try {
      // Fetch the existing KOT for the table
      const existingKOTResponse = await axios.get(
        `http://192.168.0.109:5000/api/kot/kot/${tableId}`
      );
      const existingKOT = existingKOTResponse.data;

      if (!existingKOT) {
        Alert.alert("No menu items added to the order.");
        return;
      }

      const existingItems = existingKOT.itemsWithoutBarCategory || [];
      if (existingItems.length === 0) {
        Alert.alert("No previous KOT found.");
        return;
      }

      const title = "Re-KOT";
      const items = existingItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      }));

      const lineWidth = 40; // Adjust this for the maximum width of a line

      // Center a line of text by adding spaces before it
      const centerText = (text) => {
        const padding = Math.floor((lineWidth - text.length) / 2);
        return " ".repeat(padding > 0 ? padding : 0) + text;
      };

      // Add two items on the same line with spacing
      const formatTwoColumns = (left, right, maxWidth = lineWidth) => {
        const leftText = left.padEnd(Math.floor(maxWidth / 2), " ");
        const rightText = right.padStart(maxWidth - leftText.length, " ");
        return leftText + rightText;
      };

      // Get current date and time
      const now = new Date();

      // Format date as dd/mm/yyyy
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      const currentDate = `${day}/${month}/${year}`;

      // Format time as hh:mm AM/PM
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
      const currentTime = `${formattedHours
        .toString()
        .padStart(2, "0")}:${minutes} ${period}`;

      // ESC/POS Printer formatting commands
      const ESC = "\x1B"; // ESC character
      const BOLD_ON = `${ESC}E1`; // Bold text ON
      const BOLD_OFF = `${ESC}E0`; // Bold text OFF
      const CENTER = `${ESC}a1`; // Center alignment

      // Start building the content with all text bold
      let content = `${BOLD_ON}`; // Turn bold ON
      content += `${CENTER}${title}\n\n`; // Centered title
      content += `${formatTwoColumns(`Waiter: ${waiterName}`, "")}\n`; // Align Waiter to the left
      content += `${formatTwoColumns(
        `Section: ${tableInfo.section.name}`,
        `Table: ${tableInfo.tableName}`
      )}\n`;
      content += `${formatTwoColumns(
        `Date: ${currentDate}`,
        `Time: ${currentTime}`
      )}\n`;
      content += `${centerText("---------------------------------------")}\n`;

      // Add labels for items and quantities
      content += `${"Item".padEnd(20)}  ${"Qty".padStart(6)}\n`;
      content += `${centerText("----------------------------------------")}\n`;

      items.forEach((item) => {
        const itemName = item.name;
        const quantityText = String(item.quantity).padStart(8); // Align quantity to the right

        const firstLineMaxLength = 20; // Maximum characters for the first line
        const firstLine = itemName.slice(0, firstLineMaxLength); // First portion of the name
        const remainingLine = itemName.slice(firstLineMaxLength); // Remaining portion of the name

        // First line with item name and quantity aligned to the right
        const firstLineText = `${firstLine.padEnd(20)}${quantityText}\n`;
        content += firstLineText;

        // If there's remaining text, align it under the first letter of the first line
        if (remainingLine.length > 0) {
          const secondLineText = `${" ".repeat(
            firstLine.length - firstLineMaxLength + 0
          )}${remainingLine}\n`; // Dynamic alignment
          content += secondLineText;
        }
      });

      content += `${centerText("---------------------------------------")}\n`;
      content += `${BOLD_OFF}`; // Turn bold OFF at the end

      // Send KOT content to the server for printing
      const response = await axios.post(`http://192.168.0.109:5000/print-kot`, {
        kotContent: content,
      });

      if (response.status === 200) {
        Alert.alert("Success", "RE-KOT printed successfully!");
      } else {
        throw new Error("Failed to print KOT");
      }
    } catch (error) {
      console.error("Error saving KOT:", error);
      Alert.alert("Error", "Something went wrong while saving KOT.");
    }
  };

  const showTables = () => {
    // Check if sectionId is available
    if (sectionId) {
      router.push(`/billOrder?sectionId=${sectionId}`); // Navigate to bill page with sectionId as a query parameter
    } else {
      // Optionally handle case when sectionId is not available
      console.warn("Section ID is not set.");
    }
    // router.push("/bill");
  };

  const handleCancelQuantityChange = (productName, value) => {
    // Ensure the value is numeric and set it directly
    const newValue = value ? parseInt(value, 10) : 0;

    // Update cancel quantities directly without referencing previous quantities
    setQuantitiesToCancel((prevQuantities) => ({
      ...prevQuantities,
      [productName]: newValue, // Set new cancel quantity for this product
    }));
  };

  const handleSave = async () => {
    try {
      if (currentOrder.length === 0) {
        alert("No menu items added to the order.");
        return;
      }

      const orderData = {
        tableId: tableId,
        waiterName: captain,
        sectionName: tableInfo.section.name,
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price,
        })),
        subtotal: calculateTotal().subtotal,
        barSubtotal: calculateTotal().barSubtotal,
        VAT: calculateTotal().VAT,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount: calculateTotal().acPercentageAmount,
        total: calculateTotal().total,
        menuTotal: calculateTotal().menuTotal,
        grandTotal: calculateTotal().grandTotal,
        acPercentage: acPercentage,
        vatPercentage: hotelInfo ? hotelInfo.vatPercentage : 0,
        gstPercentage: hotelInfo ? hotelInfo.gstPercentage : 0,
        isTemporary: true,
        isPrint: 1,
      };
      console.log("Order Data to Save:", orderData);

      // Check if there's an existing bill for the current table
      const existingBillResponse = await axios.get(
        `http://192.168.0.109:5000/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;

      if (existingBill && existingBill.length > 0) {
        const orderIdToUpdate = existingBill[0]._id;
        await axios.patch(
          `http://192.168.0.109:5000/api/order/update-order-by-id/${orderIdToUpdate}`,
          orderData
        );

        await axios.patch(
          `http://192.168.0.109:5000/api/kot/kot/settle/${tableId}`
        );
      } else {
        await axios.post(
          `http://192.168.0.109:5000/api/order/order/${tableId}`,
          orderData
        );
      }

      // Clean up local storage
      await AsyncStorage.removeItem(`savedBills_${tableId}`);

      // Redirect to order page
      Alert.alert("Success", "Bill Saved Successfully !");
      router.push("/bill");
    } catch (error) {
      console.error("Error preparing order:", error);
      const productNameMatch = /Insufficient stock for item (.*)/.exec(
        error.response?.data?.error
      );
      const productName = productNameMatch
        ? productNameMatch[1]
        : "Unknown Product";

      // Display popup with productName
      setShowPopup(true);
      setProductName(productName);
    }
  };
  const menu = () => {
    setDrawerOpen(true);
  };
  const tabOptions = [
    { label: "HOME", icon: "home", route: "/" },
    { label: "MENU", icon: "file", onPress: handleDrawerToggle },
    { label: "PAYMENT", icon: "dollar" },
    { label: "TABLE", icon: "table", route: "/bill" },
  ];
  const handlePrintBill = async () => {
    try {
      if (currentOrder.length === 0) {
        Alert.alert("Error", "No menu items added to the order.");
        return;
      }

      // Fetch existing bill data
      const existingBillResponse = await axios.get(
        `http://192.168.0.109:5000/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;
      console.log("Existing Bill:", existingBill);
      const orderNo = orderNumber;

      const temporaryOrderIndex = existingBill.findIndex(
        (order) => order.isTemporary
      );

      // Prepare order data for printing
      const orderData = {
        tableId: existingBill.tableId || tableId,
        sectionName: existingBill.sectionName || "",
        waiterName: existingBill.waiterName || waiterName,
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price:
            orderItem.price ||
            orderItem.pricePer[`pricePer${orderItem.barCategory}`],
          taste: orderItem.selectedTaste?.taste || "",
          barCategory: orderItem.barCategory || null,
        })),
        subtotal: calculateTotal().subtotal,
        barSubtotal: calculateTotal().barSubtotal,
        VAT: calculateTotal().VAT,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount: calculateTotal().acPercentageAmount,
        total: calculateTotal().total,
        menuTotal: calculateTotal().menuTotal,
        grandTotal: calculateTotal().grandTotal,
        acPercentage: existingBill.acPercentage || 0,
        vatPercentage: existingBill.vatPercentage || 0,
        gstPercentage: existingBill.gstPercentage || 0,
      };

      console.log("Order Data for Bill:", orderData);

      if (temporaryOrderIndex !== -1) {
        const orderIdToUpdate = existingBill[temporaryOrderIndex]._id;
        console.log("Updating Order ID:", orderIdToUpdate);
        await axios.patch(
          `http://192.168.0.109:5000/api/order/update-order-by-id/${orderIdToUpdate}`,
          { ...orderData, isTemporary: true, isPrint: 1 }
        );
        await axios.patch(
          `http://192.168.0.109:5000/api/kot/kot/settle/${tableId}`
        );
      }

      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          // second: "2-digit",
          hour12: true,
        });
      };

      // Get the current date and time
      const currentDate = new Date();
      const {
        subtotal,
        CGST,
        SGST,
        total,
        grandTotal,
        totalQuantity,
        acPercentageAmount,
      } = calculateTotal();
      const maxItemNameLength = 20; // Max length for each line in Items column
      const ESC = "\x1b"; // ESC character
      const BOLD_ON = `${ESC}E1`; // ESC E1 turns bold on
      const BOLD_OFF = `${ESC}E0`; // ESC E0 turns bold off
      const CENTER_ALIGN = `${ESC}a1`; // ESC a1 centers the text
      const LEFT_ALIGN = `${ESC}a0`; // ESC a0 aligns text to the left
      const DOUBLE_SIZE_ON = "\x1d\x21\x11"; // Double size (both width and height)
      const NORMAL_SIZE = "\x1d\x21\x00"; // Normal size

      const PAGE_WIDTH = 40; // Total width of the line

      // Function to pad spaces between label and value
      const padLabelValue = (label, value) => {
        const totalLength = label.length + value.length;
        const spacesNeeded = PAGE_WIDTH - totalLength;
        return `${label}${" ".repeat(spacesNeeded)}${value}`;
      };

      // Safeguard to ensure values are valid numbers
      const formatValue = (value) => {
        return isNaN(Number(value)) ? "0.00" : Number(value).toFixed(2);
      };
      const roundedTotal = Math.round(grandTotal); // Round up the grand total
      const formattedTotal = formatValue(roundedTotal); // Format the rounded total

      // Helper function to format a line if value is present
      const formatLine = (label, value) =>
        value > 0 ? padLabelValue(label, formatValue(value)) : "";
      const addLeftMargin = (content, marginSpaces = 4) => {
        const margin = " ".repeat(marginSpaces); // Creates a string with specified spaces
        return content
          .split("\n") // Split content into lines
          .map((line) => `${margin}${line}`) // Add margin to each line
          .join("\n"); // Join lines back together
      };
      const billContent = addLeftMargin(`
      ${CENTER_ALIGN}${DOUBLE_SIZE_ON}${"    "}${
        hotelInfo ? hotelInfo.hotelName.toUpperCase() : "HOTEL NOT FOUND"
      }${NORMAL_SIZE}
      ${
        hotelInfo && hotelInfo.hotelLogo
          ? `<img class="logo" src="http://localhost:5000/${hotelInfo.hotelLogo}" alt="Hotel Logo" style="max-height: 100px; max-width: 100px;" />`
          : ""
      }
        ${[
          hotelInfo?.address ? hotelInfo.address : "Address Not Found",
          hotelInfo?.contactNo
            ? `Phone No: ${hotelInfo.contactNo}`
            : "Mobile Not Found",
          hotelInfo?.gstNo ? `GSTIN: ${hotelInfo.gstNo}` : "",
          hotelInfo?.sacNo ? `SAC No: ${hotelInfo.sacNo}` : "",
          hotelInfo?.fssaiNo ? `FSSAI No: ${hotelInfo.fssaiNo}` : "",
        ]
          .filter(Boolean)
          .join("\n")}    
  ---------------------------------------
  ${LEFT_ALIGN}${BOLD_ON}Bill No: ${
        existingBill.length > 0
          ? existingBill[0].orderNumber
            ? existingBill[0].orderNumber
            : orderNo
          : orderNo
      }            Table No: ${BOLD_ON}${
        tableInfo ? tableInfo.tableName : "Table Not Found"
      }              Date: ${formatDate(currentDate)}      Time: ${formatTime(
        currentDate
      )}
  ${LEFT_ALIGN}Waiter: ${
        waiterName || "         "
      }                              ---------------------------------------
  SR    Items           Qty       Price
 -----------------------------------------
   ${BOLD_ON}${currentOrder
        .map((orderItem, index) => {
          const itemPrice =
            orderItem.price ||
            orderItem.pricePer?.[`pricePer${orderItem.barCategory}`];
          const formattedPrice = (itemPrice * orderItem.quantity)
            .toFixed(2)
            .padStart(8);
          let itemName = orderItem.name;
          if (itemName.length > maxItemNameLength) {
            itemName = itemName.slice(0, maxItemNameLength - 3) + "...";
          }
          // Format the first line with SR, first part of the item name, Qty, and Price
          let output = `${String(index + 1)
            .padStart(2) // SR number padded to 2 characters for alignment
            .padEnd(3)} ${itemName.padEnd(20)} ${String(
            orderItem.quantity
          ).padEnd(3)} ${formattedPrice.padStart(1)}\n`;
          return output;
        })
        .join("")} -----------------------------------------
  ${LEFT_ALIGN}Total Items: ${totalQuantity}
-----------------------------------------
${[
  padLabelValue("  Subtotal:", formatValue(subtotal)),
  CGST > 0 &&
    padLabelValue(
      `  CGST (${hotelInfo?.gstPercentage / 2 || 0}%)`,
      formatValue(CGST)
    ),

  SGST > 0 &&
    padLabelValue(
      `  SGST (${hotelInfo?.gstPercentage / 2 || 0}%)`,
      formatValue(SGST)
    ),
  acPercentageAmount > 0 &&
    padLabelValue(
      `  AC (${acPercentage || 0}%)`,
      formatValue(acPercentageAmount)
    ),
  total > 0 && padLabelValue("Bar Total:", formatValue(total)),
]
  .filter(Boolean)
  .join("\n")}        -------------------------------------------
  ${LEFT_ALIGN}${padLabelValue(
        "Grand Total:",
        `${DOUBLE_SIZE_ON}${formattedTotal}${NORMAL_SIZE}`
      )}
  ${CENTER_ALIGN}${greetings
        .map((index) => {
          return `
${index.greet}
${index.message}`;
        })
        .join("")} -------------------------------------------
    AB Software Solution: 8888732973
    `);

      // Print the bill
      const response = await axios.post(
        `http://192.168.0.109:5000/print-bill`,
        {
          billContent,
        }
      );

      await AsyncStorage.removeItem(`savedBills_${tableId}`);

      if (response.status === 200) {
        router.push("/bill");
        Alert.alert("Success", "Bill Printed Successfully !");
      } else {
        Alert.alert("Error", "Failed to print the bill.");
      }
    } catch (error) {
      console.error("Error printing bill:", error);
      Alert.alert("Error", "An error occurred while printing the bill.");
    }
  };
  const handleHome = async () => {
    router.push("/"); // Navigate to home on confirmation
  };

  const handleCheckboxChange = (menuName) => {
    setSelectedMenuNames((prev) => {
      const updatedSelected = prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName];

      // Initialize cancel quantity to 0 if newlselectedy
      if (!prev.includes(menuName)) {
        setQuantitiesToCancel((prevQuantities) => ({
          ...prevQuantities,
          [menuName]: 0,
        }));
      }

      return updatedSelected;
    });
  };

  const handleQuantityChange = (value, orderItem) => {
    // Parse the input value to ensure it's a valid non-zero integer
    let newQuantity = parseInt(value, 10);

    if (value === "" || isNaN(newQuantity) || newQuantity <= 0) {
      // Remove the product from the tapped list and current order if cleared or invalid
      setCurrentOrder((prevOrder) =>
        prevOrder.filter((item) => item.name !== orderItem.name)
      );

      setTappedProducts((prevTapped) =>
        prevTapped.filter((id) => id !== orderItem._id)
      );

      return;
    }

    // Update the quantity of the order item
    setCurrentOrder((prevOrder) =>
      prevOrder.map((item) =>
        item.name === orderItem.name ? { ...item, quantity: newQuantity } : item
      )
    );

    // Ensure the product remains in tapped products list
    setTappedProducts((prevTapped) =>
      prevTapped.includes(orderItem._id)
        ? prevTapped
        : [...prevTapped, orderItem._id]
    );
  };
  const handleQuantityChanged = (itemName, value, maxQuantity) => {
    const quantity = parseInt(value, 10);

    // Check if value is empty to allow clearing input
    if (value === "") {
      setQuantitiesToCancel((prev) => ({
        ...prev,
        [itemName]: "",
      }));
    }
    // Only set quantity if it's within allowed range
    else if (!isNaN(quantity) && quantity >= 1 && quantity <= maxQuantity) {
      setQuantitiesToCancel((prev) => ({
        ...prev,
        [itemName]: quantity,
      }));
    }
  };

  const removeFromOrder = async (product) => {
    try {
      // Fetch the existing bill (or KOT) to check for existing items
      const existingBillResponse = await axios.get(
        `http://192.168.0.109:5000/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;
      console.log("Existing Bill:", existingBill);
      let existingItems = existingBill || []; // Make sure existingItems is an array

      // Check if the existingItems array is empty
      if (existingItems.length > 0) {
        // If no existing items, initialize cancel quantity to 0 or keep it if already set
        setQuantitiesToCancel((prevQuantities) => ({
          ...prevQuantities,
          [product.name]: Math.max((prevQuantities[product.name] || 0) + 1, 0),
        }));
      }

      // Proceed with removing the item or updating the quantity in the current order
      setCurrentOrder((prevOrder) => {
        const existingItem = prevOrder.find(
          (item) => item.name === product.name
        );

        if (existingItem) {
          // Decrease the quantity or remove the item if quantity reaches 0
          const updatedOrder = prevOrder.map((item) =>
            item.name === existingItem.name
              ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 0 }
              : item
          );

          const filteredOrder = updatedOrder.filter(
            (item) => item.quantity > 0
          );

          // Ensure the cancel quantity input remains open
          setSelectedMenuNames((prevSelected) => [
            ...new Set([...prevSelected, product.name]),
          ]);

          return filteredOrder;
        }

        return prevOrder;
      });

      // Update tap counts
      setTapCounts((prevCounts) => ({
        ...prevCounts,
        [product._id]: Math.max((prevCounts[product._id] || 0) - 1, 0),
      }));
    } catch (error) {
      console.error("Error removing item from order:", error);
    }
  };

  const addToOrder = useCallback(
    async (product) => {
      try {
        // Fetch the existing bill (or KOT) to check for existing items
        const existingBillResponse = await axios.get(
          `http://192.168.0.109:5000/api/order/order/${tableId}`
        );
        const existingBill = existingBillResponse.data;
        console.log("Existing Bill:", existingBill);
        let existingItems = existingBill || []; // Ensure existingItems is an array

        // Check if the existingItems array is empty
        if (existingItems.length > 0) {
          // If there are existing items, initialize cancel quantity to 0 or keep it if already set
          setQuantitiesToCancel((prevQuantities) => ({
            ...prevQuantities,
            [product.name]: Math.max(
              (prevQuantities[product.name] || 0) - 1,
              0
            ),
          }));
        } else {
          console.log("Existing Bill is empty, no existing items to cancel.");
        }

        // Update the current order
        setCurrentOrder((prevOrder) => {
          const existingItem = prevOrder.find(
            (item) => item.name === product.name
          );

          let updatedOrder;
          if (existingItem) {
            updatedOrder = prevOrder.map((item) =>
              item.name === existingItem.name
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            updatedOrder = [
              ...prevOrder,
              {
                ...product,
                quantity: 1,
              },
            ];
          }

          return updatedOrder;
        });

        // Add product to tappedProducts list if not already present
        setTappedProducts((prevTapped) =>
          prevTapped.includes(product._id)
            ? prevTapped
            : [...prevTapped, product._id]
        );

        // Update tap counts
        setTapCounts((prevCounts) => ({
          ...prevCounts,
          [product._id]: (prevCounts[product._id] || 0) + 1,
        }));
      } catch (error) {
        console.error("Error adding item to order:", error);
      }
    },
    [
      setCurrentOrder,
      setTappedProducts,
      setTapCounts,
      setQuantitiesToCancel,
      tableId,
    ]
  );

  const kot = async () => {
    try {
      const acPercentageAmount = isACEnabled
        ? calculateTotal().acPercentageAmount
        : 0;

      const itemsWithoutBarCategory = modifiedCurrentOrder.filter(
        (orderItem) => !orderItem.barCategory
      );

      const orderData = {
        tableId,
        waiterName: captain,
        customerCount: parseInt(customerCount, 10) || " ", // Pass the customer count
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price:
            orderItem.price ||
            orderItem.pricePer[`pricePer${orderItem.barCategory}`],
          taste: orderItem.selectedTaste?.taste || "", // Default to an empty string if taste is not provided
          barCategory: orderItem.barCategory || null,
        })),
        itemsWithoutBarCategory: itemsWithoutBarCategory.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price:
            orderItem.price ||
            orderItem.pricePer?.[`pricePer${orderItem.barCategory}`],
          taste: orderItem.selectedTaste?.taste || "", // Default to an empty string if taste is not provided
          barCategory: orderItem.barCategory ? orderItem.barCategory : null,
          selectedParentId: selectedParentId,
        })),
        subtotal: calculateTotal().subtotal,
        barSubtotal: calculateTotal().barSubtotal,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        VAT: calculateTotal().VAT,
        acPercentageAmount,
        acPercentage: acPercentage,
        vatPercentage: hotelInfo ? hotelInfo.vatPercentage : 0,
        gstPercentage: hotelInfo ? hotelInfo.gstPercentage : 0,
        total: calculateTotal().total,
        menuTotal: calculateTotal().menuTotal,
        grandTotal: calculateTotal().grandTotal,
      };

      if (orderData.itemsWithoutBarCategory.length === 0) {
        Alert.alert("Error", "No Menu found in KOT");
        console.warn("No items in the order. Not saving or printing KOT.");
        return;
      }

      const existingBillResponse = await axios.get(
        `http://192.168.0.109:5000/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;
      let existingItems = [];

      if (existingBill && existingBill.length > 0) {
        const orderIdToUpdate = existingBill[0]._id;
        existingItems = existingBill[0].items;
        await axios.patch(
          `http://192.168.0.109:5000/api/order/update-order-by-id/${orderIdToUpdate}`,
          orderData
        );
      } else {
        await axios.post(
          `http://192.168.0.109:5000/api/order/order/${tableId}`,
          orderData
        );
      }

      const newItemsWithoutBarCategory =
        orderData.itemsWithoutBarCategory.filter(
          (newItem) =>
            !existingItems.some(
              (existingItem) => existingItem.name === newItem.name
            )
        );
      const updatingItemsWithoutBarCategory = orderData.itemsWithoutBarCategory
        .map((newItem) => {
          const existingItem = existingItems.find(
            (item) => item.name === newItem.name
          );
          return {
            name: newItem.name,
            quantity: existingItem
              ? newItem.quantity - existingItem.quantity
              : newItem.quantity,
          };
        })
        .filter((orderItem) => orderItem.quantity !== 0);

      const uniqueItemsWithoutBarCategory = [
        ...newItemsWithoutBarCategory,
        ...updatingItemsWithoutBarCategory,
      ];
      const uniqueItemsWithoutBarCategorySet = new Set(
        uniqueItemsWithoutBarCategory.map((item) => item.name)
      );

      const kotData = {
        tableId,
        waiterName: captain,
        customerCount,
        items: modifiedCurrentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price:
            orderItem.price ||
            orderItem.pricePer?.[`pricePer${orderItem.barCategory}`],
          taste: orderItem.selectedTaste?.taste || "", // Default to an empty string if taste is not provided
          barCategory: orderItem.barCategory ? orderItem.barCategory : null,
        })),
        itemsWithoutBarCategory: [...uniqueItemsWithoutBarCategorySet].map(
          (itemName) => {
            const orderItem = uniqueItemsWithoutBarCategory.find(
              (item) => item.name === itemName
            );

            const tasteInfo = modifiedCurrentOrder.find(
              (item) => item.name === itemName
            );

            return {
              name: orderItem.name,
              quantity: orderItem.quantity,
              price:
                orderItem.price ||
                orderItem.pricePer?.[`pricePer${orderItem.barCategory}`],
              taste: tasteInfo?.selectedTaste?.taste || "", // Default to an empty string if taste is not provided
              barCategory: orderItem.barCategory ? orderItem.barCategory : null,
            };
          }
        ),
        orderNumber,
      };

      if (kotData.itemsWithoutBarCategory.length === 0) {
        console.warn("No items in the KOT. Not saving or printing KOT.");
        return;
      }

      // Make an API call to save the KOT
      const KOTResponse = await axios.post(
        `http://192.168.0.109:5000/api/kot/kotOrder/${tableId}`,
        kotData
      );

      // console.log("KOTResponse:", KOTResponse);
      if (KOTResponse.status !== 200) {
        console.error("Failed to save KOT.");
        return;
      }

      // Print the KOT
      // await connectToPrinter();  // Connect to the LAN printer

      await printKOT(kotData.itemsWithoutBarCategory, tableInfo);
    } catch (error) {
      console.error("Error saving bill:", error);
      const productNameMatch = /Insufficient stock for item (.*)/.exec(
        error.response?.data?.error
      );
      const productName = productNameMatch
        ? productNameMatch[1]
        : "Unknown Product";
      setShowPopup(true);
      setProductName(productName);
    }
  };

  const printKOT = async (items, tableName) => {
    if (items.length === 0) return; // Prevent opening preview if no items

    const kotContent = generateOrderContent(
      items,
      tableName,
      // waiterName,
      "KOT"
    );

    console.log("Printing KOT content: ", kotContent);

    try {
      // Make an API call to the backend to print the KOT
      const response = await axios.post(`http://192.168.0.109:5000/print-kot`, {
        kotContent,
      });

      if (response.status === 200) {
        Alert.alert("Success", "KOT printed successfully!");
      } else {
        Alert.alert("Failed to print KOT");
      }
    } catch (error) {
      console.error("Printing error:", error);
      alert("Failed to print KOT");
    }
  };
  const handleCancelKOT = async () => {
    try {
      console.log("Selected menu names to cancel:", selectedMenuNames);

      if (selectedMenuNames.length === 0) {
        console.log("No items selected to cancel.");
        return;
      }

      // Validation: Check if any quantity is missing or invalid
      for (const selectedItemName of selectedMenuNames) {
        const quantityToCancel = quantitiesToCancel[selectedItemName] || 0;

        if (quantityToCancel <= 0) {
          Alert.alert(
            "Invalid Quantity",
            `Please enter a valid quantity to cancel for ${selectedItemName}.`
          );
          return; // Stop execution if invalid quantity is found
        }
      }

      let canceledItems = []; // To store items that will be canceled

      for (const selectedItemName of selectedMenuNames) {
        const selectedItem = currentOrder.find(
          (item) => item.name === selectedItemName
        );

        if (!selectedItem) {
          console.error(`Item ${selectedItemName} not found in current order`);
          continue;
        }

        // Get the quantity to cancel specified by the user
        const quantityToCancel = quantitiesToCancel[selectedItemName] || 0;

        if (quantityToCancel <= 0) {
          console.log(`Invalid quantity to cancel for ${selectedItemName}`);
          continue;
        }

        // Patch request to cancel the selected menu item
        await axios.patch(`http://192.168.0.109:5000/api/kot/${tableId}`, {
          menuName: selectedItemName,
          quantityToCancel: quantityToCancel,
        });

        // Add canceled item to the list for printing
        canceledItems.push({
          name: selectedItemName,
          quantity: quantityToCancel,
        });
      }

      // Filter out items that were fully canceled
      const updatedOrder = currentOrder.filter(
        (orderItem) =>
          !selectedMenuNames.includes(orderItem.name) ||
          orderItem.quantity > quantitiesToCancel[orderItem.name]
      );

      // Update the current order state
      setCurrentOrder(updatedOrder);

      // If there are any canceled items, print the Cancel KOT
      if (canceledItems.length > 0) {
        await printCancelKOT(canceledItems);
      } else {
        console.log("No items were canceled, so no print is needed.");
      }
    } catch (error) {
      console.error("Error cancelling KOT:", error);
    }
  };

  // Function to format and print the Cancel KOT
  const printCancelKOT = async (canceledItems) => {
    try {
      const title = "Cancel KOT";
      const lineWidth = 40; // Adjust this for the maximum width of a line

      // Center a line of text by adding spaces before it
      const centerText = (text) => {
        const padding = Math.floor((lineWidth - text.length) / 2);
        return " ".repeat(padding > 0 ? padding : 0) + text;
      };

      // Add two items on the same line with spacing
      const formatTwoColumns = (left, right, maxWidth = lineWidth) => {
        const leftText = left.padEnd(Math.floor(maxWidth / 2), " ");
        const rightText = right.padStart(maxWidth - leftText.length, " ");
        return leftText + rightText;
      };

      // Get current date and time
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      const currentDate = `${day}/${month}/${year}`;
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const currentTime = `${formattedHours
        .toString()
        .padStart(2, "0")}:${minutes} ${period}`;

      // ESC/POS Printer formatting commands
      const ESC = "\x1B"; // ESC character
      const BOLD_ON = `${ESC}E1`; // Bold text ON
      const BOLD_OFF = `${ESC}E0`; // Bold text OFF
      const CENTER = `${ESC}a1`; // Center alignment

      // Start building the content with all text bold
      let content = `${BOLD_ON}`; // Turn bold ON
      content += `${CENTER}${title}\n\n`; // Centered title
      content += `${formatTwoColumns(`Waiter: ${waiterName}`, "")}\n`; // Align Waiter to the left
      content += `${formatTwoColumns(
        `Section: ${tableInfo.section.name}`,
        `Table: ${tableInfo.tableName}`
      )}\n`;
      content += `${formatTwoColumns(
        `Date: ${currentDate}`,
        `Time: ${currentTime}`
      )}\n`;
      content += `${centerText("---------------------------------------")}\n`;

      // Add labels for canceled items
      content += `${"Item".padEnd(22)}  ${"Qty".padStart(6)}\n`;
      content += `${centerText("---------------------------------------")}\n`;

      // Add canceled items with line wrapping
      canceledItems.forEach((item) => {
        const itemName = item.name;
        const quantityText = item.quantity.toString().padStart(6); // Align quantity to the right

        const lineMaxLength = 22; // Adjust for the max width for item names
        const firstLine = itemName.slice(0, lineMaxLength); // First part of the name
        const remainingText = itemName.slice(lineMaxLength); // Remaining part of the name

        // First line with item name and quantity aligned to the right
        const firstLineText = `${firstLine.padEnd(22)}  ${quantityText}`;
        content += `${firstLineText}\n`;

        // Add remaining text if it overflows to the next lines
        let offset = 0;
        while (offset < remainingText.length) {
          const nextLine = remainingText.slice(offset, offset + lineMaxLength);
          content += `${nextLine}\n`;
          offset += lineMaxLength;
        }
      });

      content += `${centerText("---------------------------------------")}\n`;
      content += `${BOLD_OFF}`; // Turn bold OFF at the end

      // Send KOT content to the server for printing
      const response = await axios.post(`http://192.168.0.109:5000/print-kot`, {
        kotContent: content,
      });

      console.log("response", response);
      if (response.status === 200) {
        alert("Cancel KOT printed successfully!");
        router.push(`/order/${tableId}`);
      } else {
        throw new Error("Failed to print Cancel KOT");
      }
    } catch (error) {
      console.error("Error printing Cancel KOT:", error);
      Alert.alert("Error", "Something went wrong while printing Cancel KOT.");
    }
  };

  const handleTable = () => {
    router.push("/bill");
  };

  const checkKOTExistence = async () => {
    try {
      const existingBillResponse = await axios.get(
        `http://192.168.0.109:5000/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;
      setExistingItems(existingBill || []); // Set existing items
    } catch (error) {
      console.error("Error checking KOT existence:", error);
      setExistingItems([]); // If error, set to empty array
    }
  };

  return (
    <>
      <View style={{ backgroundColor: "white", padding: 5 }}>
        <View style={styles.outerContainer}>
          <View style={styles.container}>
            <Text style={styles.sectionName}>
              {tableInfo ? `${tableInfo.section.name}` : " "}
            </Text>
            <Text style={styles.tableName}>
              {tableInfo ? `Table # ${tableInfo.tableName}` : " "}
            </Text>
            <View>
              <TouchableOpacity
                onPress={handleLogout} // Define a function to handle Home button press
              >
                <FontAwesome name="sign-out" size={25} color="red" />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row", // Place TextInput and Button side by side
              alignItems: "center", // Align items vertically centered
              alignContent: "flex-start",
              // marginLeft: 90,
              marginBottom: 10,
            }}
          >
            {/* Label Text */}
            <Text
              style={{
                marginRight: 8, // Space between the text and input box
                fontSize: 14, // Adjust font size as needed
                color: "black", // Text color
                fontWeight: "600",
              }}
            >
              Customer Count:
            </Text>
            {/* Text Input Field */}
            <TextInput
              placeholder="Enter count"
              value={customerCount} // Bind state to TextInput
              onChangeText={setCustomerCount} // Update state on input change
              keyboardType="numeric" // Ensure numeric input
              style={{
                width: 100, // Set a specific width
                borderWidth: 1,
                borderColor: "black",
                borderRadius: 5,
                paddingHorizontal: 10,
                marginRight: 5, // Space between input and button
                backgroundColor: "white",
                borderTopWidth: 0,
                borderRightWidth: 0,
                borderLeftWidth: 0,
              }}
            />
          </View>
          <View style={styles.orderContainer}>
            <ScrollView style={styles.scrollView}>
              {currentOrder
                .filter((orderItem) => orderItem.quantity > 0)
                .map((orderItem) => (
                  <Pressable
                    key={orderItem._id}
                    style={styles.orderItemContainer}
                  >
                    {/* Menu details */}
                    <View style={styles.menuBox}>
                      <Text style={styles.orderItemName}>{orderItem.name}</Text>
                      <Text style={styles.priceText}>
                        {orderItem.price
                          ? `₹${orderItem.price * orderItem.quantity}`
                          : orderItem.pricePer?.[
                              `pricePer${orderItem.barCategory}`
                            ]
                          ? `₹${
                              orderItem.pricePer[
                                `pricePer${orderItem.barCategory}`
                              ] * orderItem.quantity
                            }`
                          : "Price not available"}
                      </Text>
                    </View>

                    {/* Quantity control */}
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        onPress={() => removeFromOrder(orderItem)}
                      >
                        <FontAwesome
                          name="minus-circle"
                          size={32}
                          style={styles.circleBtn}
                        />
                      </TouchableOpacity>

                      <TextInput
                        style={styles.quantityInput}
                        keyboardType="numeric"
                        value={
                          orderItem.quantity
                            ? orderItem.quantity.toString()
                            : ""
                        }
                        onChangeText={(value) =>
                          handleQuantityChange(value, orderItem)
                        }
                      />

                      <TouchableOpacity onPress={() => addToOrder(orderItem)}>
                        <FontAwesome
                          name="plus-circle"
                          size={32}
                          style={styles.circleBtn}
                        />
                      </TouchableOpacity>
                    </View>
                  </Pressable>
                ))}
            </ScrollView>

            {/* Total and action buttons */}
            <View style={{ marginTop: 4 }}>
              <Text>Total Items: {calculateTotal().totalQuantity}</Text>
            </View>
            <View style={styles.totaldiv}>
              <View>
                <View style={styles.subtotalContainer}>
                  <Text style={styles.subtotalText}>SUBTOTAL</Text>
                  <Text style={styles.subtotalText}>
                    ₹{calculateTotal().subtotal}
                  </Text>
                </View>

                {/* Additional sections for AC and GST */}
                {acPercentage > 0 && (
                  <View style={styles.subtotalContainer}>
                    <Text style={styles.subtotalText}>AC</Text>
                    <Text style={styles.subtotalText}>
                      ({acPercentage}%) ₹{calculateTotal().acPercentageAmount}
                    </Text>
                  </View>
                )}

                {isGSTEnabled && gstPercentage > 0 && (
                  <View>
                    <View style={styles.subtotalContainer}>
                      <Text style={styles.subtotalText}>CGST</Text>
                      <Text style={styles.subtotalText}>
                        ({gstPercentage / 2}%) ₹{calculateTotal().CGST}
                      </Text>
                    </View>
                    <View style={styles.subtotalContainer}>
                      <Text style={styles.subtotalText}>SGST</Text>
                      <Text style={styles.subtotalText}>
                        ({gstPercentage / 2}%) ₹{calculateTotal().SGST}
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.totalContainer}>
                  <Text style={styles.totalText}>Total</Text>
                  <Text style={styles.totalText}>
                    ₹{Math.round(calculateTotal().grandTotal) || 0}
                  </Text>
                </View>

                <View style={styles.btns}>
                  <TouchableOpacity
                    style={styles.cancalbtn}
                    onPress={() => {
                      // Check if there are any quantities to cancel
                      if (Object.keys(quantitiesToCancel).length > 0) {
                        handleCancelKOT(); // If no quantities to cancel, cancel KOT
                        console.log("Cancel KOT");
                      } else {
                        kot(); // If there are quantities to cancel, confirm KOT
                        console.log("KOT");
                      }
                    }}
                  >
                    <Text style={styles.cancelText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sendbtn} onPress={handleSave}>
                    <Text style={styles.cancelText}>Complete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity onPress={handleHome}>
                <View style={styles.footerItem}>
                  <FontAwesome name="home" color="gray" size={24} />
                  <Text>Home</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDrawerToggle}>
                <View style={styles.footerItem}>
                  <FontAwesome name="file" color="gray" size={24} />
                  <Text>Menu</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDrawerToggle}>
                <View style={styles.footerItem}>
                  <FontAwesome name="bell" color="gray" size={24} />
                  <Text>Order</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleTable}>
                <View style={styles.footerItem}>
                  <FontAwesome name="table" color="gray" size={24} />
                  <Text>Table</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={drawerOpen}
          onRequestClose={handleDrawerToggle}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
              justifyContent: "flex-start", // Align modal content at the top
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "#ffffff",
                padding: 0,
              }}
            >
         
              <Modal
                animationType="slide"
                transparent={true}
                visible={categoryModalOpen}
                onRequestClose={handleCategoryModalToggle}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark background for better contrast
                    justifyContent: "center", // Center the modal content vertically
                    paddingHorizontal: 20,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "white",
                      borderRadius: 10,
                      padding: 20,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 5,
                    }}
                  >
                    {/* Resto Menus Section */}
                    <View>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          marginBottom: 10,
                          color: "#333",
                        }}
                      >
                        Resto Groups
                      </Text>

                      <TouchableOpacity
                        onPress={() => handleCategoryClick(null)}
                        style={{
                          width: "30%",
                          height: 60,
                          margin: 5,
                          padding: 5,
                          backgroundColor:
                            selectedCategory === null ? "#f0ad4e" : "#f8c471",
                          borderRadius: 10,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            color:
                              selectedCategory === null ? "white" : "black",
                            textAlign: "center",
                          }}
                        >
                          All Menu
                        </Text>
                      </TouchableOpacity>

                      <FlatList
                        data={categories}
                        numColumns={3}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item: category }) => (
                          <TouchableOpacity
                            onPress={() => handleCategoryClick(category)}
                            style={{
                              width: "30%",
                              height: 50,
                              margin: 5,
                              padding: 8,
                              backgroundColor:
                                selectedCategory === category
                                  ? "#f0ad4e"
                                  : "#f8c471",
                              borderRadius: 10,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: "bold",
                                color:
                                  selectedCategory === category
                                    ? "white"
                                    : "black",
                              }}
                            >
                              {category.name}
                            </Text>
                          </TouchableOpacity>
                        )}
                        contentContainerStyle={{
                          paddingBottom: 20,
                        }}
                      />
                    </View>

                    {/* Divider between sections */}
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#ccc",
                        marginVertical: 20,
                      }}
                    />

                    <TouchableOpacity
                      onPress={handleCategoryModalToggle}
                      style={{
                        padding: 10,
                        backgroundColor: "#3498db",
                        borderRadius: 5,
                        alignItems: "center",
                        marginTop: 20,
                      }}
                    >
                      <Text style={{ color: "white", fontWeight: "bold" }}>
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {/* Search Input */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.sectionNameModal}>
                  {tableInfo ? `${tableInfo.section.name}` : " "}
                </Text>
                <Text style={styles.tableName}>
                  {tableInfo ? `Table # ${tableInfo.tableName}` : " "}
                </Text>
                <View>
                  <View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#d3f9d8",
                        borderRadius: 5,
                        padding: 10,
                      }}
                      onPress={handleDrawerToggle} // Replace with your navigation function
                    >
                      {/* Total Items Text */}
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#000",
                        }}
                      >
                        Add - {calculateTotal().totalQuantity}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 1,
                  padding: 5,
                }}
              >
                <TextInput
                  value={searchInput}
                  onChangeText={setSearchInput}
                  placeholder="Search Menu / Id..."
                  style={{
                    flex: 1, // Allows the input box to take all available space
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderColor: "gray",
                    borderWidth: 1.5,
                    borderRadius: 8,
                    fontSize: 14,
                    backgroundColor: "#f9f9f9", // Light background color for better contrast
                  }}
                />
                <TouchableOpacity
                  onPress={() => setSearchInput("")}
                  style={{
                    marginLeft: 8, // Spacing between the input and the button
                    backgroundColor: "#d9534f", // A red color to indicate clear/reset
                    padding: 10,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    X
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={styles.radioContainer}>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      language === "en" && styles.selected,
                    ]}
                    onPress={() => handleLanguageChange("en")}
                  >
                    <View
                      style={[
                        styles.radioInner,
                        language === "en" && styles.selectedInner,
                      ]}
                    />
                  </TouchableOpacity>
                  <Text style={styles.radioText}>English</Text>

                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      language === "mr" && styles.selected,
                    ]}
                    onPress={() => handleLanguageChange("mr")}
                  >
                    <View
                      style={[
                        styles.radioInner,
                        language === "mr" && styles.selectedInner,
                      ]}
                    />
                  </TouchableOpacity>
                  <Text style={styles.radioText}>Marathi</Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={{
                      position: "relative",
                      zIndex: 10,
                      marginRight: 9,
                    }}
                    onPress={handleCategoryModalToggle}
                  >
                    <FontAwesome name="bars" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
              {/* Menu Items */}
              {showCategoryMenus && (
                <ScrollView style={{ margin: 10 }}>
                  <View style={styles.productContainer}>
                    {(menus.menus || menus)
                      .filter(filterMenus) // Apply the filterMenus function
                      .map((product) => (
                        <TouchableOpacity
                          key={product._id}
                          onPress={() => addToOrder(product)} // Use updated addToOrder
                          style={[
                            styles.productBox,
                            tappedProducts.includes(product._id) && {
                              backgroundColor: "#d3f9d8",
                            }, // Highlight tapped products
                          ]}
                        >
                          <View style={styles.productHeader}>
                            <Text style={styles.uniqueId}>
                              {product.uniqueId}
                            </Text>
                            <Text style={styles.price}>₹{product.price}</Text>
                          </View>
                          <View style={styles.productBody}>
                            <Text style={styles.productName}>
                              {product.name}
                            </Text>
                            {tapCounts[product._id] > 0 && (
                              <Text style={styles.tapCount}>
                                Count : {tapCounts[product._id]}
                              </Text>
                            )}
                            {product.stockQty > 0 && (
                              <Text style={styles.stockQty}>
                                Q: {product.stockQty}
                              </Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      ))}
                  </View>
                </ScrollView>
              )}

              <View style={styles.footer}>
                <TouchableOpacity>
                  <View style={styles.footerItem}>
                    <FontAwesome name="home" color="gray" size={24} />
                    <Text>Home</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDrawerToggle}>
                  <View style={styles.footerItem}>
                    <FontAwesome name="file" color="gray" size={24} />
                    <Text>Menu</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDrawerToggle}>
                  <View style={styles.footerItem}>
                    <FontAwesome name="bell" color="gray" size={24} />
                    <Text>Order</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleTable}>
                  <View style={styles.footerItem}>
                    <FontAwesome name="table" color="gray" size={24} />
                    <Text>Table</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#333", // Default border color
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#fff", // Default inner circle color
  },
  selected: {
    borderColor: "#4CAF50", // Border color when selected
  },
  selectedInner: {
    backgroundColor: "#4CAF50", // Inner circle color when selected
  },
  radioText: {
    fontSize: 16,
    marginHorizontal: 5,
    color: "#333",
  },
  productContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productBox: {
    width: "32%",
    padding: 8,
    marginBottom: 8,
    backgroundColor: "white", // Default background color
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  uniqueId: {
    fontSize: 12,
    color: "#f39c12",
    fontWeight: "bold",
  },
  price: {
    fontSize: 12,
    color: "#27ae60",
    fontWeight: "bold",
  },
  productBody: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
  },
  tapCount: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  stockQty: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#e67e22",
    paddingHorizontal: 6,
    borderRadius: 8,
    marginTop: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around", // Distributes items evenly
    alignItems: "center",
    position: "fixed", // Keeps footer fixed at bottom
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#fff", // Optional: Set a background color
    borderTopWidth: 1,
    borderTopColor: "#ddd", // Optional: Add a border at the top
  },
  footerItem: {
    alignItems: "center", // Centers icon and text vertically
  },
  tab: {
    alignItems: "center",
    fontSize: 12,
  },
  tabLabel: {
    fontSize: 12,
    color: "#ffffff",
    marginTop: 5,
    color: "gray",
  },
  menuBox: {
    flexDirection: "column",
  },
  qtyBox: {
    flexDirection: "column",
    marginTop: 1,
  },
  totaldiv: {
    padding: 1,
    marginTop: 10,
    borderWidth: 1, // Light border width
    borderColor: "#d3d3d3", // Light gray border color
    borderRadius: 8, // Optional: rounded corners
  },
  cancelText: {
    color: "white",
  },
  circleBtn: {
    color: "#848884",
  },
  cancalbtn: {
    backgroundColor: "red",
    width: width * 0.3, // 10% of screen width
    height: width * 0.1, // 10% of screen width
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  sendbtn: {
    backgroundColor: "gray",
    width: width * 0.3, // 10% of screen width
    height: width * 0.1, // 10% of screen width
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  btns: {
    justifyContent: "space-around",
    display: "flex",
    flexDirection: "row",
    margin: 5,
  },
  outerContainer: {
    paddingHorizontal: width * 0.01, // 1% of screen width
    marginTop: height * -0.01, // 10% of screen height for top margin
  },
  container: {
    marginBottom: height * 0.01, // 1% of screen height for bottom margin
    marginTop: height * 0.01, // 1% of screen height for bottom margin
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionName: {
    fontWeight: "bold",
    fontSize: width * 0.05, // Font size as 5% of screen width
  },
  sectionNameModal: {
    fontWeight: "bold",
    fontSize: width * 0.05, // Font size as 5% of screen width
  },
  tableName: {
    fontSize: width * 0.05, // 4.5% of screen width
    color: "midnightblue",
    fontWeight: "bold",
  },
  orderContainer: {
    justifyContent: "center",
    height:Platform.OS === "android" ? "91%" : "92%", 
  },
  scrollView: {
    flex: 1,

    padding: width * 0.01, // 1% of screen width for padding
    maxHeight: height * 0.6, // Max height as 60% of screen height.
  },
  orderItemContainer: {
    alignItems: "center",
    backgroundColor: "#eaeaea",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    paddingLeft: 10,
    paddingRight: 30,
    borderRadius: 10,
    marginTop: 14,
  },
  orderItemName: {
    fontWeight: "semibold",
    fontSize: 18,
  },
  tasteInput: {
    marginRight: width * 0.015, // 1.5% of screen width
    padding: height * 0.005, // Padding adjusted based on height
    width: width * 0.2, // Width as 20% of screen width
    height: height * 0.04, // Height as 4% of screen height
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: width * 0.02, // Rounded corners based on screen width
    backgroundColor: "#f8f9fa",
    textAlign: "center",
    fontSize: width * 0.035, // Font size as 3.5% of screen width
    color: "#333",
  },
  tasteInputFocused: {
    minHeight: 100,
    padding: 12,
    borderColor: "#007AFF",
  },
  newTasteInput: {
    marginLeft: width * 0.02, // 2% of screen width
    padding: height * 0.004, // Padding as 0.4% of screen height
    width: width * 0.2, // Width as 20% of screen width
    height: height * 0.03, // Height as 3% of screen height
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: width * 0.02, // Rounded corners based on screen width
    backgroundColor: "#f8f9fa",
    textAlign: "center",
    fontSize: width * 0.035, // Font size as 3.5% of screen width
    color: "#333",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  quantityInput: {
    fontWeight: "semibold",
    width: width * 0.2, // 10% of screen width
    height: width * 0.1, // 10% of screen width
    textAlign: "center",
    borderRadius: width * 0.01, // Rounded corners based on width
    borderWidth: 1,
    borderColor: "black",

    marginHorizontal: width * 0.02, // Horizontal margin as 2% of screen width
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  priceText: {
    fontWeight: "semibold",
    fontSize: 28,
    marginTop: 8,
  },
  subtotalContainer: {
    paddingHorizontal: width * 0.04, // 4% of screen width for padding
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: height * 0.005, // Top margin as 0.5% of screen height
  },
  subtotalText: {
    fontWeight: "semibold",
    fontSize: 16, // Font size as 3.5% of screen width
    padding: 4,
  },
  totalContainer: {
    borderTopWidth: 1,
    paddingVertical: height * 0.005, // Vertical padding as 0.5% of screen height
    paddingHorizontal: width * 0.04, // Horizontal padding as 4% of screen width
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  totalText: {
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 27, // Font size as 4.5% of screen width
  },
  totalItemsText: {
    paddingHorizontal: width * 0.05, // Padding as 5% of screen width
    marginTop: height * -0.005, // Negative top margin based on height
    fontSize: width * 0.03, // Font size as 3% of screen width
    marginLeft: width * -0.01, // Negative left margin based on width
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: width * 0.06, // Width as 6% of screen width
    height: width * 0.06, // Height as 6% of screen width
    justifyContent: "center",
    alignItems: "center",

    marginRight: width * 0.02, // Margin as 2% of screen width
    marginLeft: width * 0.02, // Margin as 2% of screen width
  },
  checked: {
    fontSize: width * 0.05, // Font size as 5% of screen width
    color: "green",
  },
  unchecked: {
    fontSize: width * 0.05, // Font size as 5% of screen width
    color: "grey",
  },
  label: {
    fontSize: width * 0.04, // Font size as 4% of screen width
  },
});

export default BillOrder;

// // // import React, { useState, useEffect } from 'react';
// // // import { View, TextInput, Button, Text } from 'react-native';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // const SettingsScreen = () => {
// // //   const [ip, setIp] = useState('');
// // //   const [storedIp, setStoredIp] = useState('');

// // //   useEffect(() => {
// // //     // Load the stored IP address when the component mounts
// // //     const loadIp = async () => {
// // //       const savedIp = await AsyncStorage.getItem('backendIp');
// // //       if (savedIp) {
// // //         setStoredIp(savedIp);
// // //       }
// // //     };
// // //     loadIp();
// // //   }, []);

// // //   const saveIp = async () => {
// // //     try {
// // //       await AsyncStorage.setItem('backendIp', ip);
// // //       setStoredIp(ip);
// // //       alert('IP address saved successfully!');
// // //     } catch (e) {
// // //       alert('Failed to save the IP address.');
// // //     }
// // //   };

// // //   return (
// // //     <View>
// // //       <Text>Current IP: {storedIp}</Text>
// // //       <TextInput
// // //         placeholder="Enter backend IP"
// // //         value={ip}
// // //         onChangeText={setIp}
// // //         style={{ borderWidth: 1, padding: 10 }}
// // //       />
// // //       <Button title="Save IP" onPress={saveIp} />
// // //     </View>
// // //   );
// // // };

// // // export default SettingsScreen;
// // import React, { useState, useEffect } from 'react';
// // import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // const SettingsScreen = () => {
// //   const [ip, setIp] = useState('');
// //   const [storedIp, setStoredIp] = useState('');

// //   useEffect(() => {
// //     // Load the stored IP address when the component mounts
// //     const loadIp = async () => {
// //       const savedIp = await AsyncStorage.getItem('backendIp');
// //       if (savedIp) {
// //         setStoredIp(savedIp);
// //       }
// //     };
// //     loadIp();
// //   }, []);

// //   const saveIp = async () => {
// //     try {
// //       await AsyncStorage.setItem('backendIp', ip);
// //       setStoredIp(ip);
// //       alert('IP address saved successfully!');
// //     } catch (e) {
// //       alert('Failed to save the IP address.');
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Settings</Text>

// //       <Text style={styles.label}>Current IP:</Text>
// //       <Text style={styles.ipDisplay}>{storedIp || 'No IP set yet'}</Text>

// //       <TextInput
// //         placeholder="Enter backend IP"
// //         value={ip}
// //         onChangeText={setIp}
// //         style={styles.input}
// //       />

// //       <TouchableOpacity style={styles.saveButton} onPress={saveIp}>
// //         <Text style={styles.saveButtonText}>Save IP</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // export default SettingsScreen;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#f0f0f0', // Light background for a clean look
// //   },
// //   title: {
// //     fontSize: 28,
// //     fontWeight: 'bold',
// //     color: '#007BFF',
// //     marginBottom: 20,
// //   },
// //   label: {
// //     fontSize: 18,
// //     marginBottom: 8,
// //     color: '#333',
// //   },
// //   ipDisplay: {
// //     fontSize: 18,
// //     marginBottom: 20,
// //     color: '#007BFF',
// //     fontWeight: 'bold',
// //   },
// //   input: {
// //     width: '100%',
// //     height: 50,
// //     borderColor: '#ccc',
// //     borderWidth: 1,
// //     borderRadius: 10,
// //     paddingHorizontal: 15,
// //     marginBottom: 20,
// //     backgroundColor: '#fff',
// //     fontSize: 16,
// //   },
// //   saveButton: {
// //     width: '100%',
// //     height: 50,
// //     backgroundColor: '#007BFF',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderRadius: 10,
// //   },
// //   saveButtonText: {
// //     color: '#fff',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// // });


// // import React, { useState, useEffect } from 'react';
// // import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { FontAwesome } from '@expo/vector-icons'; // Importing FontAwesome for icons
// // import { router } from 'expo-router'; // Assuming you're using expo-router for navigation

// // const SettingsScreen = () => {
// //   const [ip, setIp] = useState('');
// //   const [storedIp, setStoredIp] = useState('');

// //   useEffect(() => {
// //     // Load the stored IP address when the component mounts
// //     const loadIp = async () => {
// //       const savedIp = await AsyncStorage.getItem('backendIp');
// //       if (savedIp) {
// //         setStoredIp(savedIp);
// //       }
// //     };
// //     loadIp();
// //   }, []);

// //   const saveIp = async () => {
// //     try {
// //       await AsyncStorage.setItem('backendIp', ip);
// //       setStoredIp(ip);
// //       alert('IP address saved successfully!');
// //     } catch (e) {
// //       alert('Failed to save the IP address.');
// //     }
// //   };

// //   // Back to the previous page function
// //   const goBack = () => {
// //     router.back(); // This will take the user back to the previous screen
// //   };

// //   return (
// //     <View style={styles.container}>
// //       {/* Back Arrow in the top-right corner */}
// //       <TouchableOpacity style={styles.backArrow} onPress={goBack}>
// //         <FontAwesome name="arrow-left" size={24} color="gray" />
// //       </TouchableOpacity>

// //       <Text style={styles.title}>Settings</Text>

// //       <Text style={styles.label}>Current IP:</Text>
// //       <Text style={styles.ipDisplay}>{storedIp || 'No IP set yet'}</Text>

// //       <TextInput
// //         placeholder="Enter backend IP"
// //         value={ip}
// //         onChangeText={setIp}
// //         style={styles.input}
// //       />

// //       <TouchableOpacity style={styles.saveButton} onPress={saveIp}>
// //         <Text style={styles.saveButtonText}>Save IP</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // export default SettingsScreen;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#f0f0f0',
// //   },
// //   backArrow: {
// //     position: 'absolute',
// //     top: 40,
// //     left: 20,
// //     zIndex: 1,
// //   },
// //   title: {
// //     fontSize: 28,
// //     fontWeight: 'bold',
// //     color: '#007BFF',
// //     marginBottom: 20,
// //   },
// //   label: {
// //     fontSize: 18,
// //     marginBottom: 8,
// //     color: '#333',
// //   },
// //   ipDisplay: {
// //     fontSize: 18,
// //     marginBottom: 20,
// //     color: '#007BFF',
// //     fontWeight: 'bold',
// //   },
// //   input: {
// //     width: '100%',
// //     height: 50,
// //     borderColor: '#ccc',
// //     borderWidth: 1,
// //     borderRadius: 10,
// //     paddingHorizontal: 15,
// //     marginBottom: 20,
// //     backgroundColor: '#fff',
// //     fontSize: 16,
// //   },
// //   saveButton: {
// //     width: '100%',
// //     height: 50,
// //     backgroundColor: '#007BFF',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderRadius: 10,
// //   },
// //   saveButtonText: {
// //     color: '#fff',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// // });
// /////////////////////////////////////////////////////

// // import React, { useState, useEffect } from 'react';
// // import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { FontAwesome } from '@expo/vector-icons'; // Importing FontAwesome for icons
// // import { router } from 'expo-router'; // Assuming you're using expo-router for navigation

// // const SettingsScreen = () => {
// //   const [ip, setIp] = useState('');
// //   const [storedIp, setStoredIp] = useState('');
// //   const [printerIP, setPrinterIP] = useState('');
// //   const [printerPort, setPrinterPort] = useState('');

// //   useEffect(() => {
// //     // Load the stored IP address when the component mounts
// //     const loadIp = async () => {
// //       const savedIp = await AsyncStorage.getItem('backendIp');
// //       if (savedIp) {
// //         setStoredIp(savedIp);
// //       }
// //     };
// //     loadIp();
// //   }, []);

// //   const saveIp = async () => {
// //     try {
// //       await AsyncStorage.setItem('backendIp', ip);
// //       setStoredIp(ip);
// //       alert('IP address saved successfully!');
// //     } catch (e) {
// //       alert('Failed to save the IP address.');
// //     }
// //   };

// //   // Function to send printer data to the API
// //   const savePrinterData = async () => {
// //     if (!printerIP || !printerPort) {
// //       alert('Please enter both printer IP and port.');
// //       return;
// //     }

// //     try {
// //       const response = await fetch(`http://192.168.0.109:5000/printer`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           printerIP,
// //           printerPort: parseInt(printerPort, 10), // Convert port to a number
// //         }),
// //       });

// //       if (response.ok) {
// //         Alert.alert('Success', 'Printer data saved successfully!');
// //       } else {
// //         Alert.alert('Error', 'Failed to save printer data.');
// //       }
// //     } catch (error) {
// //       Alert.alert('Error', 'Network error: Unable to reach the server.');
// //     }
// //   };

// //   // Back to the previous page function
// //   const goBack = () => {
// //     router.back(); // This will take the user back to the previous screen
// //   };

// //   return (
// //     <View style={styles.container}>
// //       {/* Back Arrow in the top-right corner */}
// //       <TouchableOpacity style={styles.backArrow} onPress={goBack}>
// //         <FontAwesome name="arrow-left" size={24} color="gray" />
// //       </TouchableOpacity>

// //       <Text style={styles.title}>Settings</Text>

// //       {/* Backend IP Address Section */}
// //       <Text style={styles.label}>Current IP:</Text>
// //       <Text style={styles.ipDisplay}>{storedIp || 'No IP set yet'}</Text>

// //       <TextInput
// //         placeholder="Enter backend IP"
// //         value={ip}
// //         onChangeText={setIp}
// //         style={styles.input}
// //       />

// //       <TouchableOpacity style={styles.saveButton} onPress={saveIp}>
// //         <Text style={styles.saveButtonText}>Save IP</Text>
// //       </TouchableOpacity>

// //       {/* Printer IP and Port Section */}
// //       <View style={styles.divider} />

// //       <Text style={styles.label}>Printer IP:</Text>
// //       <TextInput
// //         placeholder="Enter printer IP"
// //         value={printerIP}
// //         onChangeText={setPrinterIP}
// //         style={styles.input}
// //       />

// //       <Text style={styles.label}>Printer Port:</Text>
// //       <TextInput
// //         placeholder="Enter printer port"
// //         value={printerPort}
// //         onChangeText={setPrinterPort}
// //         style={styles.input}
// //         keyboardType="numeric" // Ensure only numeric input
// //       />

// //       <TouchableOpacity style={styles.saveButton} onPress={savePrinterData}>
// //         <Text style={styles.saveButtonText}>Save Printer Data</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // export default SettingsScreen;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#f0f0f0',
// //   },
// //   backArrow: {
// //     position: 'absolute',
// //     top: 40,
// //     left: 20,
// //     zIndex: 1,
// //   },
// //   title: {
// //     fontSize: 28,
// //     fontWeight: 'bold',
// //     color: '#007BFF',
// //     marginBottom: 20,
// //   },
// //   label: {
// //     fontSize: 18,
// //     marginBottom: 8,
// //     color: '#333',
// //   },
// //   ipDisplay: {
// //     fontSize: 18,
// //     marginBottom: 20,
// //     color: '#007BFF',
// //     fontWeight: 'bold',
// //   },
// //   input: {
// //     width: '100%',
// //     height: 50,
// //     borderColor: '#ccc',
// //     borderWidth: 1,
// //     borderRadius: 10,
// //     paddingHorizontal: 15,
// //     marginBottom: 20,
// //     backgroundColor: '#fff',
// //     fontSize: 16,
// //   },
// //   saveButton: {
// //     width: '100%',
// //     height: 50,
// //     backgroundColor: '#007BFF',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderRadius: 10,
// //     marginBottom: 20,
// //   },
// //   saveButtonText: {
// //     color: '#fff',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   divider: {
// //     width: '100%',
// //     height: 2,
// //     backgroundColor: '#ccc',
// //     marginVertical: 20,
// //   },
// // });

// //////////////////////////////

// import React, { useState, useEffect } from 'react';
// import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; // Importing icons from FontAwesome and MaterialIcons
// import { router } from 'expo-router';

// const SettingsScreen = () => {
//   const [ip, setIp] = useState('');
//   const [storedIp, setStoredIp] = useState('');
//   const [printerIP, setPrinterIP] = useState('');
//   const [printerPort, setPrinterPort] = useState('');

//   useEffect(() => {
//     const loadIp = async () => {
//       const savedIp = await AsyncStorage.getItem('backendIp');
//       if (savedIp) {
//         setStoredIp(savedIp);
//       }
//     };
//     loadIp();
//   }, []);

//   const saveIp = async () => {
//     try {
//       await AsyncStorage.setItem('backendIp', ip);
//       setStoredIp(ip);
//       alert('IP address saved successfully!');
//     } catch (e) {
//       alert('Failed to save the IP address.');
//     }
//   };

//   const savePrinterData = async () => {
//     if (!printerIP || !printerPort) {
//       alert('Please enter both printer IP and port.');
//       return;
//     }

//     try {
//       const response = await fetch(`http://192.168.0.109:5000/printer`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           printerIP,
//           printerPort: parseInt(printerPort, 10),
//         }),
//       });

//       if (response.ok) {
//         Alert.alert('Success', 'Printer data saved successfully!');
//       } else {
//         Alert.alert('Error', 'Failed to save printer data.');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Network error: Unable to reach the server.');
//     }
//   };

//   const goBack = () => {
//     router.back();
//   };

//   return (
//     <View style={styles.container}>
//       {/* Back Arrow */}
//       <TouchableOpacity style={styles.backArrow} onPress={goBack}>
//         <FontAwesome name="arrow-left" size={28} color="#555" />
//       </TouchableOpacity>

//       <Text style={styles.title}>Settings</Text>

//       {/* Backend IP Address Section */}
//       <View style={styles.section}>
//         <MaterialIcons name="computer" size={24} color="#007BFF" />
//         <Text style={styles.label}>Backend IP:</Text>
//         <Text style={styles.ipDisplay}>{storedIp || 'No IP set yet'}</Text>

//         <TextInput
//           placeholder="Enter backend IP"
//           value={ip}
//           onChangeText={setIp}
//           style={styles.input}
//           placeholderTextColor="#999"
//         />

//         <TouchableOpacity style={styles.saveButton} onPress={saveIp}>
//           <FontAwesome name="save" size={20} color="#fff" />
//           <Text style={styles.saveButtonText}>Save IP</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Divider */}
//       <View style={styles.divider} />

//       {/* Printer IP and Port Section */}
//       <View style={styles.section}>
//         <FontAwesome name="print" size={24} color="#007BFF" />
//         <Text style={styles.label}>Printer IP:</Text>
//         <TextInput
//           placeholder="Enter printer IP"
//           value={printerIP}
//           onChangeText={setPrinterIP}
//           style={styles.input}
//           placeholderTextColor="#999"
//         />

//         <Text style={styles.label}>Printer Port:</Text>
//         <TextInput
//           placeholder="Enter printer port"
//           value={printerPort}
//           onChangeText={setPrinterPort}
//           style={styles.input}
//           keyboardType="numeric"
//           placeholderTextColor="#999"
//         />

//         <TouchableOpacity style={styles.saveButton} onPress={savePrinterData}>
//           <FontAwesome name="save" size={20} color="#fff" />
//           <Text style={styles.saveButtonText}>Save Printer Data</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default SettingsScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     backgroundColor: '#f4f4f8',
//   },
//   backArrow: {
//     position: 'absolute',
//     top: 40,
//     left: 20,
//     zIndex: 1,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#007BFF',
//     marginBottom: 30,
//     alignSelf: 'center',
//   },
//   section: {
//     width: '100%',
//     backgroundColor: '#fff',

//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 20,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//   },
//   label: {
//     fontSize: 18,
//     marginBottom: 8,
//     color: '#333',
//     fontWeight: '600',
//   },
//   ipDisplay: {
//     fontSize: 16,
//     color: '#007BFF',
//     marginBottom: 20,
//   },
//   input: {
//     height: 50,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     backgroundColor: '#f9f9f9',
//     fontSize: 16,
//     marginBottom: 20,
//     color: '#333',
//   },
//   saveButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 50,
//     backgroundColor: '#007BFF',
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
//   divider: {
//     height: 2,
//     backgroundColor: '#ddd',
//     marginVertical: 30,
//     width: '80%',
//     alignSelf: 'center',
//   },
// });

//////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Platform, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; 
import { router } from 'expo-router';

// Get device dimensions
const { width, height } = Dimensions.get('window');

const SettingsScreen = () => {
  const [ip, setIp] = useState('');
  const [storedIp, setStoredIp] = useState('');
  const [printerIP, setPrinterIP] = useState('');
  const [printerPort, setPrinterPort] = useState('');
  const [storedPrinterIP, setStoredPrinterIP] = useState('');
  const [storedPrinterPort, setStoredPrinterPort] = useState('');

  useEffect(() => {  
    const fetchPrinterData = async () => {
      try {
        const response = await fetch(`http://192.168.0.109:5000/printerall`);
        if (response.ok) {
        const data = await response.json();
        setStoredPrinterIP(data.printerIP || '');
        setStoredPrinterPort(data.printerPort || '');
      } else {
        Alert.alert('Error', 'Failed to fetch printer data.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error: Unable to reach the server.');
    }
    fetchPrinterData()
  };
}, []);
  

  // const saveIp = async () => {
  //   if (!ip.trim()) {
  //     alert('Please enter a valid backend IP.');
  //     return;
  //   }
  //   try {
  //     await AsyncStorage.setItem('backendIp', ip);
  //     setStoredIp(ip);
  //     alert('IP address saved successfully!');
  //   } catch (e) {
  //     alert('Failed to save the IP address.');
  //   }
  // };


  const savePrinterData = async () => {
    if (!printerIP || !printerPort) {
      alert('Please enter both printer IP and port.');
      return;
    }

    try {
      const response = await fetch(`http://192.168.0.109:5000/printer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          printerIP,
          printerPort: parseInt(printerPort, 10),
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Printer data saved successfully!');
      } else {
        Alert.alert('Error', 'Failed to save printer data.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error: Unable to reach the server.');
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}  // Adjust offset
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* Back Arrow */}
          <TouchableOpacity style={styles.backArrow} onPress={goBack}>
            <FontAwesome name="arrow-left" size={28} color="#555" />
          </TouchableOpacity>

          <Text style={styles.title}>Settings</Text>

          {/* Backend IP Address Section */}
          <View style={styles.section}>
            <MaterialIcons name="computer" size={24} color="#007BFF" />
            <Text style={styles.label}>Backend IP:</Text>
            <Text style={styles.ipDisplay}>{storedIp || 'No IP set yet'}</Text>

            <TextInput
              placeholder="Enter backend IP"
              value={ip}
              onChangeText={setIp}
              style={styles.input}
              placeholderTextColor="#999"
            />

            <TouchableOpacity style={styles.saveButton} onPress={saveIp}>
              <FontAwesome name="save" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Save IP</Text>
            </TouchableOpacity>
          </View>

          {/* Printer IP and Port Section */}
          <View style={styles.section}>
            <FontAwesome name="print" size={24} color="#007BFF" />
            <Text style={styles.label}>Printer IP:</Text>
            <Text style={styles.ipDisplay}>{storedPrinterIP || 'No Printer IP set yet'}</Text>

            <TextInput
              placeholder="Enter printer IP"
              value={printerIP}
              onChangeText={setPrinterIP}
              style={styles.input}
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Printer Port:</Text>
            <Text style={styles.ipDisplay}>{storedPrinterPort || 'No Printer Port set yet'}</Text>

            <TextInput
              placeholder="Enter printer port"
              value={printerPort}
              onChangeText={setPrinterPort}
              style={styles.input}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />

            <TouchableOpacity style={styles.saveButton} onPress={savePrinterData}>
              <FontAwesome name="save" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Save Printer Data</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Math.min(width * 0.05, 20), // Use a responsive padding
    justifyContent: 'center',
    backgroundColor: '#f4f4f8',
  },
  backArrow: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 28, // Adjusted size for smaller screens
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: height * 0.03, // Responsive margin
    alignSelf: 'center',
  },
  section: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: height * 0.02, // Responsive padding
    marginBottom: height * 0.03, // Responsive margin
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  label: {
    fontSize: Math.min(height * 0.02, 18), // Responsive font size
    marginBottom: 8,
    color: '#333',
    fontWeight: '600',
  },
  ipDisplay: {
    fontSize: Math.min(height * 0.02, 16), // Responsive font size
    color: '#007BFF',
    marginBottom: height * 0.02, // Responsive margin
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    fontSize: Math.min(height * 0.02, 16), // Responsive font size
    marginBottom: height * 0.02, // Responsive margin
    color: '#333',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: '#007BFF',
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: Math.min(height * 0.02, 18), // Responsive font size
    fontWeight: 'bold',
    marginLeft: 10,
  },
});


///////////////////////////////////////////////////////////////////

// import React, { useState, useEffect } from 'react';
// import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Platform, Dimensions } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; 
// import { router } from 'expo-router';
// import { NetworkInfo } from 'react-native-network-info'; // Importing the module

// // Get device dimensions
// const { width, height } = Dimensions.get('window');

// const SettingsScreen = () => {
//   const [ip, setIp] = useState('');
//   const [storedIp, setStoredIp] = useState('');
//   const [printerIP, setPrinterIP] = useState('');
//   const [printerPort, setPrinterPort] = useState('');
//   const [storedPrinterIP, setStoredPrinterIP] = useState('');
//   const [storedPrinterPort, setStoredPrinterPort] = useState('');

//   useEffect(() => {
//     // Automatically fetch the device's IP address when the component is mounted
//     NetworkInfo.getIPV4Address().then(ipv4Address => {
//       if (ipv4Address) {
//         setIp(ipv4Address); // Set the fetched IP to the input field
//       }
//     });

//     // Load stored IP settings from AsyncStorage
//     const loadSettings = async () => {
//       const savedIp = await AsyncStorage.getItem('backendIp');
//       if (savedIp) {
//         setStoredIp(savedIp);
//         fetchPrinterData(savedIp);
//       }
//     };
//     loadSettings();
//   }, []);

//   const fetchPrinterData = async (savedIp) => {
//     try {
//       const response = await fetch(`http://192.168.0.109:5000/printerall`);
//       if (response.ok) {
//         const data = await response.json();
//         setStoredPrinterIP(data.printerIP || '');
//         setStoredPrinterPort(data.printerPort || '');
//       } else {
//         Alert.alert('Error', 'Failed to fetch printer data.');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Network error: Unable to reach the server.');
//     }
//   };

//   const saveIp = async () => {
//     if (!ip.trim()) {
//       alert('Please enter a valid backend IP.');
//       return;
//     }

//     try {
//       await AsyncStorage.setItem('backendIp', ip);
//       setStoredIp(ip);
//       alert('IP address saved successfully!');
//     } catch (e) {
//       alert('Failed to save the IP address.');
//     }
//   };

//   const savePrinterData = async () => {
//     if (!printerIP || !printerPort) {
//       alert('Please enter both printer IP and port.');
//       return;
//     }

//     try {
//       const response = await fetch(`http://192.168.0.109:5000/printer`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           printerIP,
//           printerPort: parseInt(printerPort, 10),
//         }),
//       });

//       if (response.ok) {
//         Alert.alert('Success', 'Printer data saved successfully!');
//       } else {
//         Alert.alert('Error', 'Failed to save printer data.');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Network error: Unable to reach the server.');
//     }
//   };

//   const goBack = () => {
//     router.back();
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}  // Adjust offset
//     >
//       <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//         <View style={styles.container}>
//           {/* Back Arrow */}
//           <TouchableOpacity style={styles.backArrow} onPress={goBack}>
//             <FontAwesome name="arrow-left" size={28} color="#555" />
//           </TouchableOpacity>

//           <Text style={styles.title}>Settings</Text>

//           {/* Backend IP Address Section */}
//           <View style={styles.section}>
//             <MaterialIcons name="computer" size={24} color="#007BFF" />
//             <Text style={styles.label}>Backend IP:</Text>
//             <Text style={styles.ipDisplay}>{storedIp || 'No IP set yet'}</Text>

//             <TextInput
//               placeholder="Enter backend IP"
//               value={ip}
//               onChangeText={setIp}
//               style={styles.input}
//               placeholderTextColor="#999"
//             />

//             <TouchableOpacity style={styles.saveButton} onPress={saveIp}>
//               <FontAwesome name="save" size={20} color="#fff" />
//               <Text style={styles.saveButtonText}>Save IP</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Printer IP and Port Section */}
//           <View style={styles.section}>
//             <FontAwesome name="print" size={24} color="#007BFF" />
//             <Text style={styles.label}>Printer IP:</Text>
//             <Text style={styles.ipDisplay}>{storedPrinterIP || 'No Printer IP set yet'}</Text>

//             <TextInput
//               placeholder="Enter printer IP"
//               value={printerIP}
//               onChangeText={setPrinterIP}
//               style={styles.input}
//               placeholderTextColor="#999"
//             />

//             <Text style={styles.label}>Printer Port:</Text>
//             <Text style={styles.ipDisplay}>{storedPrinterPort || 'No Printer Port set yet'}</Text>

//             <TextInput
//               placeholder="Enter printer port"
//               value={printerPort}
//               onChangeText={setPrinterPort}
//               style={styles.input}
//               keyboardType="numeric"
//               placeholderTextColor="#999"
//             />

//             <TouchableOpacity style={styles.saveButton} onPress={savePrinterData}>
//               <FontAwesome name="save" size={20} color="#fff" />
//               <Text style={styles.saveButtonText}>Save Printer Data</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// export default SettingsScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: Math.min(width * 0.05, 20), // Use a responsive padding
//     justifyContent: 'center',
//     backgroundColor: '#f4f4f8',
//   },
//   backArrow: {
//     position: 'absolute',
//     top: 40,
//     left: 20,
//     zIndex: 1,
//   },
//   title: {
//     fontSize: 28, // Adjusted size for smaller screens
//     fontWeight: 'bold',
//     color: '#007BFF',
//     marginBottom: height * 0.03, // Responsive margin
//     alignSelf: 'center',
//   },
//   section: {
//     width: '100%',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: height * 0.02, // Responsive padding
//     marginBottom: height * 0.03, // Responsive margin
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//   },
//   label: {
//     fontSize: Math.min(height * 0.02, 18), // Responsive font size
//     marginBottom: 8,
//     color: '#333',
//     fontWeight: '600',
//   },
//   ipDisplay: {
//     fontSize: Math.min(height * 0.02, 16), // Responsive font size
//     color: '#007BFF',
//     marginBottom: height * 0.02, // Responsive margin
//   },
//   input: {
//     height: 50,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     backgroundColor: '#f9f9f9',
//     fontSize: Math.min(height * 0.02, 16), // Responsive font size
//     marginBottom: height * 0.02, // Responsive margin
//     color: '#333',
//   },
//   saveButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 50,
//     backgroundColor: '#007BFF',
//     borderRadius: 10,
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: Math.min(height * 0.02, 18), // Responsive font size
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
// });

import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BillOrder from './billOrder';

const OrderPage = () => {
  const { tableId } = useLocalSearchParams();
  console.log("tableId",tableId)
  const [acPercentage, setACPercentage] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const checkAuth = async () => {
//       const authToken = await AsyncStorage.getItem('EmployeeAuthToken');
//       if (!authToken) {
//         router.push('/login');
//       }
//     };
//     checkAuth();
//   }, [router]);



  useEffect(() => {
    const fetchACPercentage = async () => {
      try {
        if (tableId) {
          const tableResponse = await axios.get(`http://192.168.0.109:5000/api/table/tables/${tableId}`);
          const table = tableResponse.data;

          const sectionResponse = await axios.get(`http://192.168.0.109:5000/api/section/${table.section._id}`);
          const section = sectionResponse.data;
          console.log(section.acPercentage);
          setACPercentage(section.acPercentage);
        }
      } catch (error) {
        Alert.alert('Error', 'Error fetching AC Percentage.');
        console.error('Error fetching AC Percentage:', error);
      }

    }
    fetchACPercentage();
  }, [tableId]);

  if (acPercentage === null) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }



  return (
    <View>
      <BillOrder tableId={tableId} acPercentage={acPercentage} />
      {/* <Text>{tableId}</Text> */}
    </View>
  );
};

export default OrderPage;

import React, { useState, useEffect, useRef } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import axios from "axios"; // Make sure axios is imported
import AsyncStorage from "@react-native-async-storage/async-storage";

const PaymentModal = ({
  onClose,
  selectedTableId,
  tableName,
  totalAmount,
  orderID,
  orderNumber,
  items,
  waiterName,
  sgst,
  cgst,
  visible,
}) => {
  const [cashReceived, setCashReceived] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Cash"); // Default to "Cash"
  const [cardReceived, setCardReceived] = useState("");
  const [onlineReceived, setOnlineReceived] = useState("");

  // Ensure totalAmount, sgst, and cgst are valid numbers
  const validTotalAmount = totalAmount && !isNaN(totalAmount) ? totalAmount : 0;
  const validSgst = sgst && !isNaN(sgst) ? sgst : 0;
  const validCgst = cgst && !isNaN(cgst) ? cgst : 0;

  const subtotal = validTotalAmount;
  const totalTax = validSgst + validCgst;
  const total = subtotal + totalTax;

  




const handleCompleteOrder = async () => {
  try {
    const updatedOrder = {
      items: items, // Array of items to be updated
      orderID,
      orderNumber,
      waiterName,
      cashAmount: parseFloat(cashReceived) || 0, // Convert to number
      onlinePaymentAmount: parseFloat(onlineReceived) || 0, // Convert to number
      totalAmount,
      subtotal,
      SGST: validSgst,
      CGST: validCgst,
      grandTotal: total,
      isPrint: 1,
      isTemporary: false,
      customerCount: "1", // Adjust if customer count needs to be dynamic
      orderDate: new Date(),
      isCook: true,
      sectionName: "Garden",
      flag: 0,
    };

    const response = await axios.patch(
      `http://192.168.0.109:5000/api/order/update-order-by-id/${orderID}`,
      updatedOrder
    );

    console.log("Order updated successfully:", response.data);
    alert("Payment Processed Successfully");
    onClose();
  } catch (error) {
    console.error("Error processing the order:", error);
  }
};

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Payment Details</Text>

          <View style={styles.tableRow}>
            <Text style={styles.tableInfoText}>Table: {tableName}</Text>
            <Text style={styles.tableInfoText}>Order Number: {orderNumber}</Text>
          </View>

          {/* Rest of your content */}
          <View style={styles.payableAmountContainer}>
            <Text style={styles.payableAmountText}>
              Payable Amount: ₹{validTotalAmount.toFixed(2)}
            </Text>
          </View>

          {/* Waiter Information */}
          <View style={styles.tableInfoContainer}>
            <Text style={styles.tableInfoText}>Waiter: {waiterName}</Text>
          </View>

          {/* Render Items */}
          <ScrollView style={styles.itemsContainer}>
            <Text style={styles.itemsTitle}>Items:</Text>
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <View key={item._id || index} style={styles.itemContainer}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemText}>
                    Price: ₹{item.price.toFixed(2)}
                  </Text>
                  <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
                  <Text style={styles.itemText}>Taste: {item.taste}</Text>
                  {item.isCanceled && (
                    <Text style={styles.canceledText}>Item Cancelled</Text>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.noItemsText}>No items found</Text>
            )}
          </ScrollView>

          <View style={styles.paymentMethodsContainer}>
            <Text style={styles.paymentMethodsText}>Payment Method:</Text>
            <View style={styles.paymentButtons}>
              <TouchableOpacity
                style={[
                  styles.paymentButton,
                  selectedPaymentMethod === "Cash" &&
                    styles.selectedPaymentButton,
                ]}
                onPress={() => setSelectedPaymentMethod("Cash")}
              >
                <Text style={styles.paymentButtonText}>Cash</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.paymentButton,
                  selectedPaymentMethod === "Card" &&
                    styles.selectedPaymentButton,
                ]}
                onPress={() => setSelectedPaymentMethod("Card")}
              >
                <Text style={styles.paymentButtonText}>Card</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.paymentButton,
                  selectedPaymentMethod === "Online" &&
                    styles.selectedPaymentButton,
                ]}
                onPress={() => setSelectedPaymentMethod("Online")}
              >
                <Text style={styles.paymentButtonText}>Online</Text>
              </TouchableOpacity>
            </View>
          </View>

          {selectedPaymentMethod === "Cash" && (
            <View style={styles.cashReceivedContainer}>
              <Text style={styles.cashReceivedText}>Add Cash Received: ₹</Text>
              <TextInput
                style={styles.cashReceivedInput}
                value={cashReceived}
                onChangeText={setCashReceived}
                keyboardType="numeric"
                placeholder="Enter amount"
              />
            </View>
          )}

          {selectedPaymentMethod === "Card" && (
            <View style={styles.cashReceivedContainer}>
              <Text style={styles.cashReceivedText}>Add Card Received: ₹</Text>
              <TextInput
                style={styles.cashReceivedInput}
                value={cardReceived}
                onChangeText={setCardReceived}
                keyboardType="numeric"
                placeholder="Enter amount"
              />
            </View>
          )}

          {selectedPaymentMethod === "Online" && (
            <View style={styles.cashReceivedContainer}>
              <Text style={styles.cashReceivedText}>
                Add Online Received: ₹
              </Text>
              <TextInput
                style={styles.cashReceivedInput}
                value={onlineReceived}
                onChangeText={setOnlineReceived}
                keyboardType="numeric"
                placeholder="Enter amount"
              />
            </View>
          )}

          {/* Subtotal, SGST, CGST, and Total */}
          <View style={styles.taxDetailsContainer}>
            <View style={styles.taxDetailRow}>
              <Text style={styles.taxDetailsText}>Subtotal:</Text>
              <Text style={styles.taxDetailsText}>₹{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.taxDetailRow}>
              <Text style={styles.taxDetailsText}>SGST:</Text>
              <Text style={styles.taxDetailsText}>₹{validSgst.toFixed(2)}</Text>
            </View>
            <View style={styles.taxDetailRow}>
              <Text style={styles.taxDetailsText}>CGST:</Text>
              <Text style={styles.taxDetailsText}>₹{validCgst.toFixed(2)}</Text>
            </View>
            <View style={styles.taxDetailRow}>
              <Text style={styles.taxDetailsText}>Total:</Text>
              <Text style={styles.taxDetailsText}>₹{total.toFixed(2)}</Text>
            </View>
          </View>

          {/* Complete Button */}
          <TouchableOpacity onPress={handleCompleteOrder} style={styles.completeButton}>
            <Text style={styles.completeButtonText}>Complete</Text>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  selectedPaymentButton: {
    backgroundColor: "#008CBA", // Highlight color for the selected button
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
    position: "relative",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  payableAmountContainer: {
    marginBottom: 15,
  },
  payableAmountText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  guessText: {
    fontSize: 14,
    color: "gray",
  },
  tableInfoContainer: {
    marginBottom: 15,
    paddingHorizontal: 10,
  },
tableRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 15,
},
tableInfoText: {
  fontSize: 16,
  fontWeight: "600",
  color: "#333",
},


  itemsContainer: {
    maxHeight: 250,
    marginBottom: 15,
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemContainer: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemText: {
    fontSize: 14,
    marginTop: 5,
  },
  canceledText: {
    fontSize: 14,
    color: "red",
    marginTop: 5,
  },
  noItemsText: {
    fontSize: 14,
    color: "gray",
  },
  paymentMethodsContainer: {
    marginBottom: 15,
  },
  paymentMethodsText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  paymentButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paymentButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  paymentButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cashReceivedContainer: {
    marginBottom: 15,
  },
  cashReceivedText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cashReceivedInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginTop: 5,
  },
  taxDetailsContainer: {
    marginBottom: 15,
    flexDirection: "column", // Align the rows vertically
  },
  taxDetailRow: {
    flexDirection: "row", // Align text horizontally
    justifyContent: "space-between", // Distribute the text evenly
    marginBottom: 5, // Space between the rows
  },
  taxDetailsText: {
    fontSize: 16,
  },
  completeButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute", // Make the button absolute
    top: 1, // Distance from the top of the container
    right: 1, // Distance from the right of the container
    padding: 10, // Padding around the button text
    borderRadius: 5, // Rounded corners
  },
  closeButtonText: {
    color: "red", // White text
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default PaymentModal;

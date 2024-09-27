import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const Contact = () => {
  const [contact, setContact] = useState('');

  const handleSubmit = () => {
    Alert.alert('Contact submitted: ' + contact);
  };

  return (
    <View>
      <TextInput placeholder="Enter contact info" value={contact} onChangeText={setContact} />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

export default Contact;
import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const Dashboard = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{ data: [10, 20, 30, 40, 50] }],
  };

  return (
    <View>
      <LineChart data={data} width={300} height={200} />
    </View>
  );
}

export default Dashboard;
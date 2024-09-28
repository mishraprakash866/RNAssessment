import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { THEMESTYLE } from '../config/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { firestore } from '../config/Firebase';
import moment from 'moment';

const Dashboard = () => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<number[]>([]);
  const [months, setMonths] = useState<string[]>([]);

  useLayoutEffect(() => {
    fetchUserRegistrations();
  }, []);

  const fetchUserRegistrations = async () => {
    try {
      const usersSnapshot = await firestore().collection('users').get();
      const users = usersSnapshot.docs.map(doc => doc.data());
      const userCountsPerMonth: number[] = new Array(12).fill(0);

      users.forEach(user => {
        if (user.createdAt) {
          const registrationMonth = moment(user.createdAt).month();
          userCountsPerMonth[registrationMonth]++;
        }
      });

      const filteredMonths: React.SetStateAction<string[]> = [];
      const filteredCounts: React.SetStateAction<number[]> = [];

      userCountsPerMonth.forEach((count, index) => {
        if (count > 0) {
          if(index > 0){
            let findItem = filteredMonths.find((ele) => ele === moment().month(index - 1).format('MMM'));
            if(!findItem){
              filteredMonths.push(moment().month(index - 1).format('MMM'));
              filteredCounts.push(0);
            }
          }
          filteredMonths.push(moment().month(index).format('MMM'));
          filteredCounts.push(count);
        }
      });

      setMonthlyData(filteredCounts);
      setMonths(filteredMonths);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text style={{color:'#000'}}>Loading data...</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingTop: insets.top, flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.title}>Dashboard</Text>

      <LineChart
        data={{
          labels: months,
          datasets: [
            {
              data: monthlyData
            }
          ]
        }}
        width={THEMESTYLE.D_Width - 30}
        height={260}
        fromZero={true}
        yAxisInterval={1}
        yAxisSuffix=" users"
        chartConfig={{
          decimalPlaces: 0,
          backgroundColor: '#1e90ff',
          backgroundGradientFrom: '#1e90ff',
          backgroundGradientTo: '#1e90ff',
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#1e9aff",
          }
        }}
        bezier
        style={{
          padding: 10,
          borderRadius: 8
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Dashboard;

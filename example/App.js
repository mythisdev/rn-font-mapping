/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
} from 'react-native';

import fontMapping from './custom-fonts.json';

import {Text as BaseText} from 'rn-font-mapping';
const Text = (props)=>{
  return <BaseText {...props} fontMapping={fontMapping} />
}

const fontWeight = ['100', '300', '400', '500', '700', '900'];


const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
        >
          <View style={styles.fontModule}>
         {
              fontWeight.map(weight=>{
                return (
                  <Text key={`italic${weight}`} style={[styles.label, {
                    fontStyle: 'italic',
                    fontWeight: weight
                  }]}>Italic - {weight}</Text>
                )
              })
            }
         </View>
         <View style={styles.fontModule}>
            {
              fontWeight.map(weight=>{
                return (
                  <Text key={`normal${weight}`} style={[styles.label, {
                    fontStyle: 'normal',
                    fontWeight: weight
                  }]}>Normal - {weight}</Text>
                )
              })
            }
         </View>

        


        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  fontModule: {
    margin: 20
  },
  label: {
    fontFamily: 'Roboto',
    fontSize: 16
  }
  
});

export default App;

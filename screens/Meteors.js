import React, { Component } from 'react';
import { Text, View, Alert } from 'react-native';
import axios from 'axios';
import { object } from 'prop-types';

export default class MeteorScreen extends Component {
    constructor() {
        super();
        this.state = { meteors: {} }
    }
    componentDidMount() {
        this.getdata()
    }
    getdata = () => {
        axios
            .get("https://api.nasa.gov/neo/rest/v1/feed?api_key=3rCil0Ky3oQLSNOTtLlCMqmdIote9MZRct6HhrNI")
            .then(response => {
                this.setState({
                    meteors: response.data.near_earth_objects
                })
            })
            .catch(error => {
                Alert.alert(error.message)
            })
    }
    render() {
        if (Object.keys(this.state.meteors).length === 0) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Text>Loading...</Text>
                </View>
            )
        } else {
            var mArray = Object.keys(this.state.meteors).map(meteor_date => {
                return
                this.state.meteors[meteor_date]
            })
            var meteors = [].concat.apply([], mArray)
            console.log(meteors);
            meteors.forEach(function (element) {
                var diameter = (element.estimated_diameter.kilometers.estimated_diameter_min + element.estimated_diameter.kilometers.estimated_diameter_max) / 2
                var threadScore = (diameter / element.close_approach_data[0].miss_distance.kilometers) * 10000000000
            });
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Text>Meteor Screen!</Text>
                </View>
            )
        }
    }
}

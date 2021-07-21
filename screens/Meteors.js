import React, { Component } from 'react';
import { Text, View, Alert, FlatList, SafeAreaView, ImageBackground, Image, Dimensions } from 'react-native';
import axios from "axios";

export default class MeteorScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meteors: {},
        };
    }

    componentDidMount() {
        this.getMeteors()
    }

    getMeteors = () => {
        axios
            .get("https://api.nasa.gov/neo/rest/v1/feed?api_key=nAkq24DJ2dHxzqXyzfdreTvczCVOnwJuFLFq4bDZ")
            .then(response => {
                this.setState({ meteors: response.data.near_earth_objects })
            })
            .catch(error => {
                Alert.alert(error.message)
            })
    }

    keyExtractor = (item, index) => index.toString();

    renderItem = ({ item }) => {
        var meteor = item
        var bg, speed, size
        if (meteor.threat_score <= 30) {
            bg = require("../assets/meteor_bg1.png")
            speed = require("../assets/meteor_speed1.gif")
            size = 100
        } else if (meteor.threat_score > 75) {
            bg = require("../assets/meteor_bg2.png")
            speed = require("../assets/meteor_speed2.gif")
            size = 150
        } else {
            bg = require("../assets/meteor_bg3.png")
            speed = require("../assets/meteor_speed3.gif")
            size = 200
        }
        return (
            <View>
                <ImageBackground source={bg} style={{
                    flex: 1, resizeMode: "cover", width: Dimensions.get("window").width,
                    height: Dimensions.get("window").height
                }} />
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Image source={speed} style={{ width: size, hieght: size, alignSelf: "center" }} />
                    <View>
                        <Text style={{ fontsize: 20, marginBottom: 10, fontWeight: "bold", color: "white", marginTop: 400, marginLeft: 50 }}>{item.name}</Text>
                        <Text style={{ fontsize: 20, marginBottom: 10, fontWeight: "bold", color: "white", marginTop: 5, marginLeft: 50 }}>Velocity - {item.close_approach_data[0].relative_velocity.kilometers_per_hour}</Text>
                    </View>
                </View>
            </View>

        )
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
                    <Text>Loading</Text>
                </View>
            )
        } else {
            let meteor_arr = Object.keys(this.state.meteors).map(meteor_date => {
                return this.state.meteors[meteor_date]
            })
            let meteors = [].concat.apply([], meteor_arr);

            meteors.forEach(function (element) {
                let diameter = (element.estimated_diameter.kilometers.estimated_diameter_min + element.estimated_diameter.kilometers.estimated_diameter_max) / 2
                let threatScore = (diameter / element.close_approach_data[0].miss_distance.kilometers) * 1000000000
                element.threat_score = threatScore;
            });
            meteors.sort(function (a, b) {
                return b.threat_score - a.threat_score
            })
            meteors = meteors.slice(0, 5)
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <SafeAreaView>
                        <FlatList data={meteors} renderItem={this.renderItem} keyExtractor={this.keyExtractor} horizontal={true} />
                    </SafeAreaView>
                </View>
            )
        }
    }
}
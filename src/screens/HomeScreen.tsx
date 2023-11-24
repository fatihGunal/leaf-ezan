import { View, StyleSheet, Image, Text, Button, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import TimeIndicator from '../components/TimeIndicator'
import Colors from '../util/Colors'
import PrayerTime from '../components/PrayerTime'
import GetLocation from 'react-native-get-location';
import moment from 'moment'

const BASE_URL_ADHAN = 'http://api.aladhan.com/v1/timingsByCity?';
const BASE_URL_GEO = 'https://nominatim.openstreetmap.org/reverse?';
const CALC_METHOD = 13

const HomeScreen = ({navigation}: {navigation: any}) => {
    const [data, setData] = useState<any | undefined>(undefined)
    const [showDate, setShowDate] = useState();
    const [remainingTime, setRemainingTime] = useState<string | null>(null);

    let dateCheck: boolean = false

    const onPressDate = () => {
        if (dateCheck === false) {
            dateCheck = true
            setShowDate(data?.date.readable)
        } else {
            dateCheck = false
            setShowDate(data?.date.hijri.date)
        }
    }

    useEffect(() => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
        })
        .then(location => {
            const urlGeo = `${BASE_URL_GEO}format=json&lat=${location?.latitude}&lon=${location?.longitude}`
            fetch(urlGeo)
            .then((respone) => respone.json())
            .then((json) => {
                const urlAdhan = `${BASE_URL_ADHAN}city=${json.address.town}&country=${json.address.country_code}&method=${CALC_METHOD}`;
                fetch(urlAdhan)
                .then((respone) => respone.json())
                .then((json) => {
                    setData(json.data)
                    setShowDate(json.data.date.readable)
                    setRemainingTime(getNextPrayerTime(json.data.timings));
                })
                .catch((error) => console.error(error))
            })
            .catch((error) => console.error(error))
        })
        .catch(error => {
            const { code, message } = error;
            console.warn(code, message);
        })

    }, [])

    // const getNextPrayerTime = (prayerData: any): string | null => {
        //   MAJOR REFACTORING NEEDED -------------
    //     const allowed = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
    //     const filtered = Object.keys(prayerData || {})
    //         .filter(key => allowed.includes(key))
    //         .reduce((obj, key) => {
    //             obj[key] = prayerData[key]
    //         return obj
    //     }, {} as any)
        
    //     const now = moment(moment().format(), 'hh:mm:ss')

    //     let nextPrayerTime: string = '';
    //     let testDate = new Date()
    //     testDate.setHours(18)
    //     testDate.setMinutes(0)

    //     // let closestTime: number = now.valueOf()
    //     let closestTimestamp: number = testDate.valueOf()


    //     Object.entries(filtered).forEach(([key, value]: [string, any], index) => {
    //         const inputValue = moment(value, 'hh:mm:ss')
    //         const diff = moment(inputValue).diff(moment(testDate))

    //         if (diff < 0) {
    //         } else if (closestTimestamp < diff) {
    //         } else {
    //             nextPrayerTime = key
    //             closestTimestamp = diff
    //         }
    //     });

    //     var tempTime = moment.duration(closestTimestamp)
    //     var closestTimeReadable = tempTime.hours() + ':' + tempTime.minutes() + ':' + tempTime.seconds()
        
    //     console.log(closestTimeReadable)
    //     console.log(nextPrayerTime)
    //     return filtered[nextPrayerTime];
    // };

    const getNextPrayerTime = (prayerData: PrayerData): string | null => {
        const allowedPrayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        const filteredPrayerData: PrayerData = Object.keys(prayerData || {})
          .filter(key => allowedPrayers.includes(key))
          .reduce((obj, key) => {
            obj[key] = prayerData[key];
            return obj;
          }, {} as PrayerData);
      
        const now = moment();
        // const now = new Date();
        // now.setHours(13)
        // now.setMinutes(0)
      
        let nextPrayerTime: string | null = null;
        let closestTimestamp: number = Infinity;
      
        

        for (const [prayer, time] of Object.entries(filteredPrayerData)) {
          const prayerTime = moment(time, 'hh:mm:ss');
          const diff = prayerTime.diff(now);
      
          if (diff > 0 && diff < closestTimestamp) {
            nextPrayerTime = prayer;
            closestTimestamp = diff;
          }
        }
      
        if (nextPrayerTime !== null) {
          const closestTimeReadable = moment.utc(closestTimestamp).format('HH:mm:ss');
            return closestTimeReadable;
        } else {
          console.log('No upcoming prayer time found.');
          return 'well done!';
        }
    };


  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <View>
                <TimeIndicator name='Kalan Sure' value={remainingTime}/>            
            </View>
            <View>
                <Pressable style={styles.button} onPress={onPressDate}>
                    <Text style={styles.button_text}>{showDate}</Text>
                </Pressable>
            </View>
        </View>
        <View style={styles.inner_container}>
            <View style={styles.prayer_times}>
                <View style={styles.row}>
                    <PrayerTime name='Imsak' value={data?.timings.Fajr!} />
                    <PrayerTime name='Gunes' value={data?.timings.Sunrise!}/>
                </View>
                <View style={styles.row}>
                    <PrayerTime name='Ogle' value={data?.timings.Dhuhr!}/>
                    <PrayerTime name='Ikindi' value={data?.timings.Asr!}/>
                </View>
                <View style={styles.row}>
                    <PrayerTime name='Aksam' value={data?.timings.Maghrib!}/>
                    <PrayerTime name='Yatsi' value={data?.timings.Isha!}/>
                </View>
            </View>
            <View style={{marginTop: 30, alignItems: 'center'}}>
            <Image 
                source={require('../../assets/images/leaf-fall.png')}
                style={{width: 110, height: 110, opacity: 0.6}}    
            />
            </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.background
    },
    header: {
        height: '25%',
        width: '100%',
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.background,
        marginTop: 45
    },
    inner_container: {
        width: '100%',
        flex: 2.4,
        backgroundColor: Colors.containerbackground,
        borderTopStartRadius: 50,
        borderTopEndRadius: 50,
        alignContent: 'center'
    },
    prayer_times: {
        marginTop: 40,
        alignItems: 'center'
    },
    row: {
        width: 250,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 5
    },
    button: {
        backgroundColor: Colors.containerbackground,
        color: Colors.values,
        padding: 10,
        borderRadius: 50
    },
    button_text: {
        color: Colors.values,
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 20,
        marginRight: 20
    }
})

interface PrayerData {
    [key: string]: string;
  }

// interface LiveTimes {
//     Fajr: string;
//     Sunrise: string;
//     Dhuhr: string;
//     Asr: string;
//     Maghrib: string;
//     Isha: string
// }

export default HomeScreen


// npm run
// npm run android
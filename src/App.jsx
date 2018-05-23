import Styles from "./App.less";
import axios from "axios";
import quip from "quip";

const currentMoment = Date.now();
const iconImg = "https://openweathermap.org/img/w/";
const { getRootRecord } = quip.apps;

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            city: getRootRecord().get('city'),
            weatherInformation: {},
            selectedDate: getRootRecord().get('date'),
            humanReadableDate: getRootRecord().get('humanReadableDate'),
            appRendered: false
        };
    }

    getWeatherForDate = (selectedDate, weatherData) => {
        let selectedDateinSeconds = (selectedDate / 1000) + 43200;
        let weatherObj = weatherData.filter(function (item, index) {
            return selectedDateinSeconds >= weatherData[index].dt && selectedDateinSeconds <= weatherData[index + 1].dt;
        });
        return weatherObj;
    }

    getWeatherForecast = (city, date) => {
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=` + city + `,us&appid=0c89292d0ae3c8cb24f3aca4b5e96104&units=imperial`)
            .then(res => {
                const weatherList = res.data.list;
                const weatherInformation = this.getWeatherForDate(date, weatherList)[0];
                if (typeof weatherInformation !== "undefined" && weatherInformation.hasOwnProperty("main") && weatherInformation.main.hasOwnProperty("temp")) {
                    weatherInformation.main.temprature = Math.round(weatherInformation.main.temp) + "°F";
                }
                this.setState({ weatherInformation: weatherInformation, city: city, selectedDate: date });
            }
            );
    }

    handleSubmit = (e) => {
        const enteredCity = this.refs["text"].value;
        const enteredDate = this.state.selectedDate;
        const enteredHumanDate = this.state.humanReadableDate;
        if (enteredCity.length > 0 && enteredDate) {
            this.setState({ city: enteredCity });
            getRootRecord().set("city", enteredCity);
            getRootRecord().set("date", enteredDate);
            getRootRecord().set('humanReadableDate', enteredHumanDate);
            this.getWeatherForecast(enteredCity, enteredDate);
        }
    }

    onDateSelected = (date) => {
        const humanReadableDate = new Date(date).toLocaleDateString();
        this.setState({ selectedDate: date, humanReadableDate: humanReadableDate });
    }

    render() {
        const style = {
            backgroundColor: `${quip.apps.ui.ColorMap.YELLOW.VALUE_LIGHT}`,
            border: `1px solid ${quip.apps.ui.ColorMap.YELLOW.VALUE}`,
            boxShadow: "0 2px 5px 5px rgba(0, 0, 0, 0.1)",
            padding: 10,
        };

        const renderCity = this.state.city;
        const renderDate = this.state.selectedDate;
        const showInput = !renderCity || !renderDate;

        if (renderCity && renderDate && !this.state.appRendered) {
            this.setState({
                appRendered: true
            })
            this.getWeatherForecast(renderCity, renderDate);
        }

        return (
            <div style={style}>
                {showInput &&
                    <input ref="text" type="text" ></input>
                }
                {showInput &&
                    <quip.apps.ui.CalendarPicker
                        initialSelectedDateMs={currentMoment}
                        onChangeSelectedDateMs={this.onDateSelected}
                    />
                }
                {showInput &&
                    <button onClick={this.handleSubmit}>Submit</button>
                }
                {!showInput &&
                    <span> Weather for </span>
                }
                {this.state && this.state.city &&
                    <span><strong> {this.state.city}</strong></span>
                }
                {!showInput &&
                    <span> on </span>
                }
                {this.state && this.state.humanReadableDate &&
                    <span><strong> {this.state.humanReadableDate}</strong></span>
                }
                <div>
                    {this.state && this.state.weatherInformation && this.state.weatherInformation.weather &&
                        <img src={iconImg + this.state.weatherInformation.weather[0].icon + ".png"} alt="" />
                    }
                    {this.state && this.state.weatherInformation && this.state.weatherInformation.weather &&
                        <span> {this.state.weatherInformation.weather[0].description}</span>
                    }
                    {this.state && this.state.weatherInformation && this.state.weatherInformation.main &&
                        < span > {this.state.weatherInformation.main.temprature}</span>
                    }
                </div>
            </div >
        )
    }
}

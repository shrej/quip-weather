import quip from "quip";
import App from "./App.jsx";


class WeatherRoot extends quip.apps.RootRecord {
    static getProperties() {
        return {
            city: "string",
            date: "number",
            humanReadableDate: "string"
        };
    }
}
quip.apps.registerClass(WeatherRoot, "root");


quip.apps.initialize({
    initializationCallback: function (rootNode, params) {
        let rootRecord = quip.apps.getRootRecord();
        if (params.isCreation) {
            rootRecord.set("city", '');
            rootRecord.set("date", 0);
            rootRecord.set("humanReadableDate", '');
        }
        ReactDOM.render(<App />, rootNode);
    },
});

import "./App.css";

import Graph from "./components/Graph/Graph";
import {
  getAltitudeDegreesAtDateAndLatitude,
  getDegreesFromHours,
} from "./lib/utils";

const MS_PER_HOUR = 1000 * 60 * 60;
function App() {
  return (
    <div className="App">
      <h1>The great cluster in Hercules (M13) in Paris' sky tonight</h1>
      <Graph
        fn={(hrs) => {
          const parisLatitude = 48.8566;
          const parisLongitude = 2.3522;
          const m13RA = getDegreesFromHours(16 + 41.7 / 60);
          const m13Dec = 36 + 28 / 60;
          const todayAtMidnight = new Date();
          todayAtMidnight.setHours(0, 0, 0, 0);

          return getAltitudeDegreesAtDateAndLatitude({
            date: new Date(todayAtMidnight.getTime() + hrs * MS_PER_HOUR),
            lat: parisLatitude,
            long: parisLongitude,
            ra: m13RA,
            dec: m13Dec,
          });
        }}
        xMin={-12}
        xMax={12}
        interval={0.1}
        yMin={0}
        yMax={90}
      />
    </div>
  );
}

export default App;

import Datepicker from "./Datepicker/Datepicker";

function onChange(timestamp) {
  console.log(timestamp);
}

function App() {
  return (
    <div className="App">
      <Datepicker onChange={onChange} />
    </div>
  );
}

export default App;

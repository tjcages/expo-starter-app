import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import reduxStore from "./store/store";
import { StatusBar } from "./components";

import DataController from "./navigation/DataController";

export default function App() {
  // Provider: handle the local data layer
  // PersistGate: load & save data to the local layer (for performance & offline use)
  // DataController: navigation managed by the data layer (all pages)
  // StatusBar: the default themed OS status bar

  return (
    <Provider store={reduxStore.store}>
      <PersistGate loading={null} persistor={reduxStore.persistor}>
        <DataController />
        <StatusBar />
      </PersistGate>
    </Provider>
  );
}

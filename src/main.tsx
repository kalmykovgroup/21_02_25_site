import { createRoot } from 'react-dom/client'
import './index.css'
import {Provider} from "react-redux";
import {StrictMode} from "react";
import {persistor, store} from "./store/store.ts";
import App from "./App.tsx";
import {PersistGate} from "redux-persist/integration/react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      {/* Оборачиваем все приложение в Provider */}
      <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
              <App />
          </PersistGate>
      </Provider>
  </StrictMode>,
)

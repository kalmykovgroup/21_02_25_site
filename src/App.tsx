
import AppRouter from "./routes/AppRouter.tsx";
import {DeviceProvider} from "./DeviceContext.tsx";

const App = () => {
    return  (
        <DeviceProvider>
            <AppRouter />
        </DeviceProvider>
    )
};

export default App

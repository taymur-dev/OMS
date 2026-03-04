import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/Store.tsx";
import { PersistGate } from "redux-persist/integration/react";
import { Slide, ToastContainer } from "react-toastify";
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
      <ToastContainer
        position="top-center" // Professional UI me mostly top-right best hota hai
        autoClose={1500} // Faster auto-close for better UX
        hideProgressBar={true} // Hide default progress bar for cleaner look
        newestOnTop={true} // Newest notification on top for better visibility
        closeOnClick // Allow closing on click
        rtl={false} // Default left-to-right
        pauseOnFocusLoss={false} // Avoid pausing on focus loss
        draggable={false} // Stop dragging for consistent positioning
        pauseOnHover // Keep toast visible when hovered
        theme="colored" // Use colored theme for better UI contrast
        transition={Slide} // Smoother transition instead of Bounce
        style={{
          borderRadius: "8px", // Slightly rounded corners
          fontSize: "14px", // Professional font size
        }}
      />
    </PersistGate>
  </Provider>,
);

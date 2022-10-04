import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Context";
import routes from "./Config/routes.js";
import Navbar from "./Common/Navbar";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    {routes.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={route.element}
                        />
                    ))}
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;

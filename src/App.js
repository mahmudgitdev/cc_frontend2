import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeScreen from "./views/HomeScreen";
import LoginScreen from "./views/LoginScreen";
import SignupScreen from "./views/SignupScreen";
import ProfileScreen from "./views/ProfileScreen";
import CreateScreen from "./views/CreateScreen";
import SingleQuizScreen from "./views/SingleQuizScreen";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<LoginScreen />} />
        <Route path="/auth/register" element={<SignupScreen />} />
        <Route path="/quiz/details/:id" element={<SingleQuizScreen />} />
        <Route element={<ProtectedRoute />}>
            <Route exact path="/" element={<HomeScreen />} />
            <Route exact path="/profile" element={<ProfileScreen />} />
            <Route exact path="/create" element={<CreateScreen />} />
        </Route>
      </Routes>
    </Router>
  )
}


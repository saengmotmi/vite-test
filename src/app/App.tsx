import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home/ui/Home";
import Layout from "../widgets/TodoList/ui/Layout";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;

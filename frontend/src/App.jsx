// import { useState } from "react";

// import AuthLayout from "./layouts/AuthLayout";
// import LoginPage from "./pages/LoginPage";
// import CharacterSelectionPage from "./pages/CharacterSelectionPage";
// import WorldViewport from "./components/game/world/WorldViewport";

// export default function App() {
//   const [screen, setScreen] = useState("world");

//   return (
//     <>
//       {/* Development Screen Switcher */}
//       <div className="fixed top-4 left-4 z-[9999] flex gap-2 rounded-xl bg-white/90 p-2 shadow-lg">
//         <button
//           onClick={() => setScreen("login")}
//           className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white"
//         >
//           Login
//         </button>

//         <button
//           onClick={() => setScreen("character")}
//           className="rounded-lg bg-green-600 px-3 py-2 text-sm font-bold text-white"
//         >
//           Character
//         </button>

//         <button
//           onClick={() => setScreen("world")}
//           className="rounded-lg bg-orange-600 px-3 py-2 text-sm font-bold text-white"
//         >
//           World
//         </button>
//       </div>

//       {screen === "login" && (
//         <AuthLayout>
//           <LoginPage />
//         </AuthLayout>
//       )}

//       {screen === "character" && (
//         <AuthLayout>
//           <CharacterSelectionPage />
//         </AuthLayout>
//       )}

//       {screen === "world" && <WorldViewport />}
//     </>
//   );
// }
import WorldViewport from "./components/game/world/WorldViewport";

function App() {
  return <WorldViewport />;
}

export default App;
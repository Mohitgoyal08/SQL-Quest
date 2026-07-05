import AuthLayout from "./layouts/AuthLayout";
import CharacterSelectionPage from "./pages/CharacterSelectionPage";

export default function App() {
  return (
    <AuthLayout>
      <CharacterSelectionPage />
    </AuthLayout>
  );
}
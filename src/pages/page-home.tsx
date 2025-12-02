import { Outlet } from "react-router";
import Text from "../components/text";
export default function PageHome() {
  return (
    <>
      <Text>Página Inicial!</Text>
      <hr />
      <Outlet />
    </>
  );
}

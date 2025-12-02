import { useParams } from "react-router";
import Text from "../components/text";
export default function PagePhotoDetails() {
  const { id } = useParams();
  return (
    <>
      <Text variant="heading-medium">Página de detalhe da foto</Text>
      <hr />
      <Text variant="heading-medium">Id da foto: {id}</Text>
    </>
  );
}

import NavBar from "../../Nav";
import { Container } from "react-bootstrap";

import AddButtonFile from "./AddButtonFile";

export default function Files() {
  return (
    <>
      <NavBar />
      <Container>
        <h2>Gestor de documentos</h2>
        <AddButtonFile />
      </Container>
    </>
  );
}

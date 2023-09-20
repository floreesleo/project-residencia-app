import { useState } from "react";
import NavBar from "../../Nav";
import { Container, Button, Modal, Form } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowUp } from "@fortawesome/free-solid-svg-icons";

export default function Documentos() {
  const [showFile, setShowFile] = useState(false);

  return (
    <>
      <NavBar />
      <Container>
        <h2>Gestor de documentos</h2>
        <Button
          variant="outline-success"
          size="sm"
          onClick={() => setShowFile(true)}
        >
          <FontAwesomeIcon icon={faFileArrowUp} />
        </Button>
        <Form.Group className="mb-3" controlId="formFile">
          <Form.Control type="file" />
        </Form.Group>
        <hr />
        <h3>Tus documentos</h3>
      </Container>

      {/* MODAL */}
      <Modal
        show={showFile}
        onHide={() => setShowFile(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Subir archivo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Seleccionar archivo</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Nombre del documento</Form.Label>
              <Form.Control type="text" placeholder="Documento" />
            </Form.Group>
            <Form.Group>
              <Button type="submit" variant="success" className="mt-2">
                Subir
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
// React
import { useEffect, useState, useRef } from "react";

import NavBar from "../navegacion/Nav";
import FooterBar from "../navegacion/Footer";

// Bootstrap
import {
  Container,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Alert,
  Dropdown,
} from "react-bootstrap";

// Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowUp, faFile } from "@fortawesome/free-solid-svg-icons";

// react-router-dom
import { Link } from "react-router-dom";

// supabase
import {
  useSupabaseClient,
  useUser,
  // useSession,
} from "@supabase/auth-helpers-react";

import { QRCodeSVG } from "qrcode.react";

// URL donde está almacenada la base de datos de storage, módulo donde se suben documentos
// https://uqfpbuoqfqebdwurfoer.supabase.co/storage/v1/object/public/documentos/05e281c3-be78-4933-8609-ed16f9cabce6/asdasdasd
const CDNURL =
  "https://uqfpbuoqfqebdwurfoer.supabase.co/storage/v1/object/public/documentos/";

export default function Documentos() {
  const [showFile, setShowFile] = useState(false);

  // variables de supabase para trabajar con el usuario que inició sesión
  const user = useUser();
  const supabaseClient = useSupabaseClient();
  // const sessionSupabase = useSession();

  const [documentos, setDocumentos] = useState([]);

  // constante del nombre del documento
  const [nombreDoc, setNombreDoc] = useState("");

  const docInputRef = useRef(null);

  useEffect(() => {
    // Si el usuario existe, obtiene todos los documentos de supabase
    if (user) getDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Funcion para obtener todos los archivos del storage donde se pasa como parametro el id del usuario iniciado
  async function getDocs() {
    const { data, error } = await supabaseClient.storage
      .from("documentos")
      .list(user?.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (data !== null) {
      setDocumentos(data);
    } else {
      console.error(error);
    }
  }

  async function uploadDoc(ev) {
    let doc = ev.target.files[0];

    const { data, error } = await supabaseClient.storage
      .from("documentos")
      .upload(user.id + "/" + nombreDoc, doc);

    if (data) {
      getDocs();
    } else {
      console.error(error);
    }
  }

  async function deleteDoc(docName) {
    const { error } = await supabaseClient.storage
      .from("documentos")
      .remove([user.id + "/" + docName]);

    if (error) {
      alert(error);
    } else {
      getDocs();
    }
  }

  // CÓDIGO QR
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <NavBar />
      <Container style={{ marginTop: "4rem", marginBottom: "6rem" }}>
        <Button variant="outline-dark" as={Link} to="/perfil" size="sm">
          Ver perfil
        </Button>
        <h1>Gestor de documentos</h1>

        {/* Modal para subir documento */}
        <Button
          variant="outline-success"
          size="sm"
          onClick={() => setShowFile(true)}
        >
          <FontAwesomeIcon icon={faFileArrowUp} />
        </Button>
        <hr />
        <h3>Tus documentos</h3>
        <Row xs={2} md={3} className="g-4">
          {/* Mapea los documentos y los muestra por medio de un Card */}
          {documentos.map((documento) => {
            return (
              // Obtiene como llave la url, el id del usuario y el nombde del documento
              <Col key={CDNURL + user.id + "/" + documento.name}>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="outline-dark"
                    id="dropdown-basic"
                    className="text-truncate w-100"
                  >
                    {/* Icono de archivo */}
                    <FontAwesomeIcon
                      icon={faFile}
                      style={{ marginRight: "5px" }}
                    />
                    {documento.name}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      href={CDNURL + user.id + "/" + documento.name}
                    >
                      Descargar documento
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleShow}>
                      Mostrar código QR
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => deleteDoc(documento.name)}>
                      Borrar documento
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            );
          })}
        </Row>
      </Container>
      <FooterBar />
      {/* MODAL */}
      <Modal
        show={showFile}
        onHide={() => setShowFile(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        className="mt-5"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Subir documento
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="d-flex justify-content-center align-items-center">
            <Alert key="secondary" variant="secondary" className="text-center">
              Primero debe dar un nombre al documento y luego seleccionar el
              documento a subir.
            </Alert>
          </Container>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre del documento</Form.Label>
              <Form.Control
                type="text"
                placeholder="Documento"
                onChange={(ev) => setNombreDoc(ev.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formFile">
              <Form.Label>Seleccionar documento</Form.Label>
              <Form.Control
                type="file"
                disabled={nombreDoc.length === 0}
                accept="image/png, image/jpge, image/jpg, .doc, .docx, .txt, .pdf"
                onChange={(ev) => uploadDoc(ev)}
                ref={docInputRef}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>

      {documentos.map((documento) => {
        // obtiene todos los datos de la tabla "documentos" de supabase y se usa el nombre del documento y la URL para usarlos en el código QR
        return (
          <Modal
            key={CDNURL + user.id + "/" + documento.name}
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            size="sm"
            className="mt-5"
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Compartir documento por código QR | {documento.name}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <QRCodeSVG
                value={CDNURL + user.id + "/" + documento.name} // Obtiene la URL del archivo del usuario
                size="300"
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="dark" onClick={handleClose}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
        );
      })}
    </>
  );
}

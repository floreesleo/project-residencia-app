// React
import { useEffect } from "react";

// Bootstrap
import { Card, Button, Container } from "react-bootstrap";

// NewsContext
import { useNews } from "../../../../context/NewsContext";

import { Link } from "react-router-dom";

export default function CRUDPublicaciones() {
  const { publicaciones, getPublicaciones } = useNews();

  useEffect(() => {
    getPublicaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditar = () => {
    console.log("editando...");
  };

  const eliminarPublicacion = (id) => {
    console.log("eliminando..." + id);
  };

  return (
    <>
      <Container>
        <h1>Modificar publicaciones</h1>
        {publicaciones.map((publicacion) => (
          <Card
            style={{ width: "18rem", marginTop: "1rem" }}
            key={publicacion.id}
          >
            <Card.Body>
              <Card.Title>{publicacion.titulo}</Card.Title>
              <Card.Text>{publicacion.contenido}</Card.Text>
              <Button
                variant="outline-success"
                className="w-100"
                onClick={() => handleEditar()}
              >
                Editar publicación
              </Button>
              <Button
                variant="outline-danger"
                className="w-100 mt-2"
                onClick={() => eliminarPublicacion(publicacion.id)}
              >
                Eliminar publicación
              </Button>
            </Card.Body>
          </Card>
        ))}
        <Button variant="link" as={Link} to="/administrador">
          Regresar al administrador
        </Button>
      </Container>
    </>
  );
}

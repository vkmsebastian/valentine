import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'css-doodle';
import HeartAnimation from './Heart';
import Player from './Player.js';
import {Container, Row, Col, Card, Image} from 'react-bootstrap';
import pic from './PlayerFiles/pic.JPG';

function App() {
  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
          </Card>
        </Col>
        <Col>
         {/* <Image src={pic} thumbnail/> */}
        </Col>
        <Col>
          <Player />
        </Col>
      </Row>
    <HeartAnimation />
    </Container>
  );
}

export default App;

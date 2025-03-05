import React from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const AddNameScreen = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg" style={{ width: "500px", borderRadius: "12px" }}>
        <h3 className="text-center mb-3" style={{ color: "rgb(29, 53, 87)", fontWeight: "600", fontSize: "30px"}}>Oh hey! Let's get to know you</h3>
        <Form>
          <Form.Group className="mb-4">
            <Form.Label>Enter Your Name</Form.Label>
            <Form.Control type="text" placeholder="Your name" />
          </Form.Group>
          <div className="d-flex justify-content-center">
            <Button variant="primary" className="rounded-circle d-flex justify-content-center align-items-center p-3 shadow" style={{ width: "50px", height: "50px" }}>
              <ArrowRight size={20} />
            </Button>
          </div>
          <p className="text-center mt-3" style={{ fontSize: "14px", color: "gray" }}>Step 2 of 4</p>
        </Form>
      </Card>
    </Container>
  );
};

export default AddNameScreen;
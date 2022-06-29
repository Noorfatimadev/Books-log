import React, { useState, useEffect } from "react";
import { Form, Alert, InputGroup, Button, ButtonGroup, Container, Navbar, Row, Col,  Table, Modal,  ModalHeader, ModalBody} from "react-bootstrap";
 
//import StartFirebase from "./firebase-config.js";
//import {ref , set , get, update, remove, child} from "firebase/database";
//import React from "react";
import db from "../firebase-config";
import { ref , push, get, update, remove} from "firebase/database"; 
 

const AddBook = () => {
  
  //states
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("Available");
  const [flag, setFlag] = useState(true); 
  const [message, setMessage] = useState({ error: false, msg: ""});
  const [bookId, setBookId] = useState("");
  const [modal, setModal] = useState(false);
  const [edID, setEdID]=useState("");
  const [booklists, setBooklists] = useState([]);
  const [edtitle, setEdTitle]=useState("");
  const [edauthor, setEdAuthor]=useState("");
  const [edStatus, setEdStatus]=useState("");
  const [edflag, setEdFlag] = useState(true); 
  useEffect(() => {

    getBooks();
   },
   []);


  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\function to add book in firebase\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  const handleSubmit = async (e) => 
  {
      e.preventDefault();
      setMessage("");
      if (title === "" || author === "")
      {
        setMessage({ error: true, msg: "All fields are mandatory!" });
        return;
      }
      console.log("reach1"); 
      
      const bookCollectionRef= ref(db, "Book")
      console.log("reach2");
      const newBook = 
      {   title: title,
          author: author, 
          status: status
        } 
      
      console.log("New Book added successfully");
      push(bookCollectionRef, newBook);
      
    

    setMessage({ error: false, msg: "New Book added successfully!" });
  };
 
  
 

   //\\\\\\\\\\\\\\\\\\\\\\\\\\\\Function to fetch book from firebase \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

   const getBooks = async () => {
     
      get(ref( db, "Book")).then((books) => {
          if (books.exists()) {
            // map function 
            setBooklists(
                Object.keys(books.val()).map(
                    (key) => 
                    (
                        {   title: books.val()[key].title,
                            author: books.val()[key].author,
                            status: books.val()[key].status,
                            id: key,
                        }
                        
                    )
                  )
              )
  
         console.log("books recieved");
      } 
      
      else 
      {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    })
   
     
  }; 

  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\Function to delete books \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  const deleteHandler = async (id) => {

     remove(ref(db, "Book/" + id));
     console.log("Book removed successfully");
  }; 
  
  
  const passedit= async (book) =>
  {
    setModal(!modal);
    console.log(title);
    setEdID(book.id); 
    setEdTitle(book.title);
    setEdAuthor(book.author);
    setEdStatus(book.status);
    if(book.status==="Available")
    {
      setEdFlag(true);
    }
  };
  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\Function to edit book\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  const editHandler = async (ID) => {
      const editBook = 
      { title:  edtitle,
        author:  edauthor, 
        status:  edStatus
      } 
   //   console.log(ID.title);
    update(ref(db, "Book/" + ID), editBook);
    
    setModal(!modal);
    
    console.log("Book edited successfully")

  }; 
   
  return (
    <>
     <Navbar bg="dark" variant="dark" className="header">
        <Container>
          <Navbar.Brand href="#home">Library - Firebase CRUD</Navbar.Brand>
        </Container>
      </Navbar>

      <Container style={{ width: "400px" }}>
        <Row>
          <Col>
            <div className="p-4 box">
              { 
                message?.msg && 
                (
                  <Alert
                  variant={message?.error ? "danger" : "success"}
                  dismissible
                  onClose={() => setMessage("")}
                  >
                  {message?.msg}
                  </Alert>
                )
              }

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBookTitle">
                  <InputGroup>
                    <InputGroup.Text id="formBookTitle">B</InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Book Title"
                      //value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBookAuthor">
                  <InputGroup>
                    <InputGroup.Text id="formBookAuthor">A</InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Book Author"
                      //value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
                <ButtonGroup aria-label="Basic example" className="mb-3">
                  <Button
                    disabled={flag}
                    variant="success"
                    onClick={(e) => {
                      setStatus("Available");
                      setFlag(true);
                    }}
                  >
                    Available
                  </Button>
                  <Button
                    variant="danger"
                    disabled={!flag}
                    onClick={(e) => {
                      setStatus("Not Available");
                      setFlag(false);
                    }}
                  >
                    Not Available
                  </Button>
                </ButtonGroup>
                <div className="d-grid gap-2">
                  <Button variant="primary" type="Submit" onClick={handleSubmit}>
                    Add
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col>
          
      <div className="mb-2">
        <Button variant="dark edit"
         onClick={getBooks} > 
        
          Refresh List
        </Button>
      </div>

      {/* <pre>{JSON.stringify(books, undefined, 2)}</pre>} */}
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            
            <th>Book Title</th>
            <th>Book Author</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
       
        <tbody>
           {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*modal popup start*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/}
           <Modal 
                  size='lg'
                  show={modal}  >
                  
                  <ModalHeader >
                   Edit
                   
                  </ModalHeader> 
                  <ModalBody>
               
                    <form  onSubmit={(e) => editHandler(edID)}> 
                      <Row>
                        <Col lg={12}>
                            <div>
                              <label htmlFor="Book-title">
                                Book Title
                                {console.log("modal1")}
                              </label>
                              <input 
                              type="text"
                              className="form-control"
                              placeholder="Enter Book Title"
                              required
                              value={edtitle}
                              onChange={(e) =>  setEdTitle(e.target.value)}
                                
                            
                              /> 
                              <label htmlFor="author">
                                Author
                              </label>
                              <input 
                              type="text"
                              className="form-control"
                              placeholder="Enter Book Author"
                              required
                              value={edauthor}
                              onChange={(e) => setEdAuthor(e.target.value)}
                              />

                            </div>
                        </Col>
                      </Row>
                      <ButtonGroup aria-label="Basic example" className="mb-3" >
                      <Button
                            disabled={edflag}
                            variant="success"
                            onClick={ (e) => 
                              {
                                setEdStatus("Available");
                                setEdFlag(true);
                              }
                            }
                      >
                    Available
                  </Button>
                  <Button
                    variant="danger"
                    disabled={!edflag}
                    onClick={(e) => {
                    setEdStatus("Not Available");
                    setEdFlag(false);
                    }}
                  >
                    Not Available
                  </Button>
                  
                  </ButtonGroup>
                  <Container> 
                  <Button
                    className="edit-submit"
                   type="submit"
                    >
                      Edit Submit

                  </Button>
                  </Container>
                    </form>
                    
                  </ModalBody>
                </Modal>
                 {/*\\\\\\\\\\\\\\\\\\modal popup end*\\\\\\\\\\\\\\\*/}
         
        { 
          React.Children.toArray(
          
          booklists.map((book, index) =>  
          (
              <tr >
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.status}</td>
                
                <td>
              

                  <Button
                    variant="secondary"
                    className="edit" 
                    onClick={() => passedit(book)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    className="delete"
                    onClick={(e) => deleteHandler(book.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
              
            ) 
            
           )
         ) 
       }  
        </tbody>
      </Table>
      
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AddBook;
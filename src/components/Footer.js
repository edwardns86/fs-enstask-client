import React from 'react'
import { FaGoogleDrive, FaChrome } from "react-icons/fa";
import {Button, Container} from 'react-bootstrap';

export default function Footer() {
    return (
        <div >
            <Container fluid='true' className="footer ">
            
            <h6 className="footer-title">Useful Links</h6>
            <Button className="m-2" variant="outline-primary" href='https://edandsarna.com' target="_blank">
                <FaChrome /> Edandsarna.com
            </Button>
            <Button className="m-2" variant="outline-primary" href='https://drive.google.com/open?id=17ftLSiOAj6EIJABNfemvz8lLAAUDBCzm' target="_blank">
                <FaGoogleDrive /> Product Images 2020 
            </Button>
            <Button className="m-2" variant="outline-primary" href='https://drive.google.com/open?id=1Dikdi9tuOxblUaJiQe0oKNTGzl1_c9dO' target="_blank">
                <FaGoogleDrive /> Advertising Images 
            </Button>
            <Button className="m-2" variant="outline-primary" href='https://docs.google.com/spreadsheets/d/1dOV5A9OmnIAwtf2Y-FJcKTrKQj7Ffj0iW6kahnV6F7g/edit?usp=sharing' target="_blank">
                <FaGoogleDrive /> Sales Data
            </Button>
            <Button className="m-2" variant="outline-primary" href='https://drive.google.com/open?id=0B0nLg3GrfIQhRTkzZFQwSlYwWjQ' target="_blank">
                <FaGoogleDrive /> Resized Images
            </Button>
            </Container>
        </div>
    )
}

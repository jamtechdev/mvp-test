import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="position-relative z-5">
      <Container>
        <Row>
          <Col md={6}>
            <Image
              src={"/images/updated-logo.png"}
              alt=" Logo"
              className="logo"
              width={180}
              height={50}
            />
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took
            </p>
          </Col>

          <Col md={3}>
            <div className="ps-xl-5">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li>
                  <Link href="/" className="text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </Col>

          <Col md={3}>
            <h5>Follow Us</h5>
            <div className="d-flex gap-3 social-links">
              <Link href="https://www.facebook.com" target="_blank">
                <FaFacebookF />
              </Link>
              <Link href="https://www.twitter.com" target="_blank">
                <FaTwitter />
              </Link>
              <Link href="https://www.instagram.com" target="_blank">
                <FaInstagram />
              </Link>
            </div>
          </Col>
        </Row>

        <Row className="border-top mt-5">
          <Col className="text-center mt-4">
            <small>
              © {new Date().getFullYear()} Umbrella Performance. All Rights Reserved.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

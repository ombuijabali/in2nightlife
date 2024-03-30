import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import partyImage2 from '../log2.jpg'; // Adjust the file name if necessary
import partyImage1 from '../log1.jpg'; // Adjust the file name if necessary
import { Container, Row, Col, Card, Button } from 'react-bootstrap';


const TopCard = ({ title, description, buttonText, imgSrc, onClick }) => (
  <Card className="top-card">
    {imgSrc && <Card.Img variant="top" src={imgSrc} alt="Heading" />}
    <div className="overlay">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Button variant="info" onClick={onClick}>{buttonText}</Button>
      </Card.Body>
    </div>
  </Card>
);

// Utility function to generate star ratings
const generateStarRating = (rating) => {
  const totalStars = 5;
  let stars = [];
  for (let i = 1; i <= totalStars; i++) {
    if (i <= rating) {
      stars.push(<i className="fas fa-star" style={{ color: 'gold' }} key={i}></i>);
    } else {
      stars.push(<i className="far fa-star" style={{ color: 'gold' }} key={i}></i>);
    }
  }
  return stars;
};

const TestimonialCard = ({ testimonial }) => (
  <Col md={4}>
    <Card className="testimonial-card">
      {testimonial.customer_image && (
        <Card.Img variant="top" src={`http://localhost:8000${testimonial.customer_image}`} alt={testimonial.customer_name} className="rounded-circle mx-auto d-block" style={{ width: '100px', height: '100px', objectFit: 'cover' }}/>
      )}
      <Card.Body>
        <Card.Title>{testimonial.customer_name}</Card.Title>
        <Card.Text>
          <div className="star-rating">{generateStarRating(testimonial.star_rating)}</div>
        </Card.Text>
        <blockquote className="blockquote mb-0">
          <p>{testimonial.comment}</p>
        </blockquote>
      </Card.Body>
    </Card>
  </Col>
);

const AboutCard = ({ title, description, buttonText, imgSrc, onClick }) => (
  <Card className="about-card">
    {imgSrc && <Card.Img variant="top" src={imgSrc} alt="Heading" />}
    <div className="overlay">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Button variant="info" onClick={onClick}>{buttonText}</Button>
      </Card.Body>
    </div>
  </Card>
);

const LandingPage = () => {
  const navigate = useNavigate();
  
  const navigateToLogin = () => navigate('/login');
  const navigateToAboutUs = () => navigate('/about-us');

  const [testimonials, setTestimonials] = useState([]);
  const [displayedTestimonials, setDisplayedTestimonials] = useState([]);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/testimonials/');
        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    const cycleTestimonials = () => {
      if (testimonials.length > 0) {
        const nextIndex = (testimonialIndex + 3) % testimonials.length;
        setDisplayedTestimonials(testimonials.slice(nextIndex, nextIndex + 3));
        setTestimonialIndex(nextIndex);
      }
    };

    const intervalId = setInterval(cycleTestimonials, 5000); // Change every 5 seconds
    return () => clearInterval(intervalId);
  }, [testimonials, testimonialIndex]);

  useEffect(() => {
    if (testimonials.length > 0) {
      setDisplayedTestimonials(testimonials.slice(0, 3));
    }
  }, [testimonials]);

  return (
    <>
      <div className="landing-page">
        <Container>
          <Row className="mb-4">
            <Col md={6}>
              <TopCard
                title="Welcome to In2Nightlife"
                description="Discover your perfect night out. Join us for electrifying music, vibrant atmospheres, and memorable moments!"
                buttonText="Get Started"
                imgSrc={partyImage1}
                onClick={navigateToLogin}
              />
            </Col>
            <Col md={6}>
              <AboutCard
                imgSrc={partyImage2}
                title="About Us"
                description="Learn more about what we do and how we can make your nightlife experience better than ever."
                buttonText="Learn More"
                onClick={navigateToAboutUs}
              />
            </Col>
          </Row>
          <hr style={{ width: '100%' }} /> {/* Corrected */}
          <Row>
            <Col md={12}>
              <div className="testimonials-section">
                <h2 className="testimonials-header">Testimonials</h2>
                <Row xs={1} md={3} className="g-4">
                  {testimonials.map((testimonial, idx) => (
                    <TestimonialCard key={idx} testimonial={testimonial} />
                  ))}
                </Row>
              </div>
            </Col>

          </Row>
        </Container>
      </div>

      <footer className="footer">
        <Container>
          <p>&copy; 2024 In2Nightlife. All rights reserved.</p>{"\t"}{"\t"}
          <p>Support: <a href="mailto:calgary@gmail.com">calgary@gmail.com</a></p><br/>
          <p> Calgary, Florida Building. 49458-00100, Canada</p>
          <div className="social-icons">
            {/* Use appropriate hrefs for your social links */}
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook" style={{ color: 'blue' }}></i></a>
            <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter" style={{ color: 'lightblue' }}></i></a>
            <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram" style={{ color: 'red' }}></i></a>
            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube" style={{ color: 'red' }}></i></a>
          </div>
        </Container>
      </footer>

    </>
  );
};

export default LandingPage;

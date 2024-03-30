import React from 'react';
// Import your images if they are stored locally in your src or public folder
import abtImage from '../log12.jpg';
import abcImage from '../log11.jpg';
import { Carousel } from 'react-bootstrap'; // Import the Carousel component from react-bootstrap
import aosImage1 from '../log7.jpg';
import aosImage2 from '../log8.jpg';
import aosImage3 from '../log9.jpg';
import './AboutComponent.css';

const AboutComponent = ({ aboutUsDetails }) => {
  return (
    <>
      <header style={{ background: `url(${abtImage}) center center/cover no-repeat`, height: '400px', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', textAlign: 'center' }}>
          {/* Possibly some header content here */}
        </div>
      </header>

      <section id="who-we-are" style={{ marginTop: '20px' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <img src={abcImage} alt="Areas of Service" className="img-fluid" style={{ height: '70%' }} />
            </div>
            <div className="col-md-6 text-red">
              <p>At In2Nightlife, we understand that every night out is an opportunity for an extraordinary experience. That's why our platform uses cutting-edge technology to analyze your preferences and suggests the best nightlife options. Whether you're looking for a quiet evening with cocktails, an exhilarating dance floor, or live entertainment, we have something for everyone.</p>
              <p>We pride ourselves on our insider knowledge of Calgary's nightlife. Our team is constantly on the lookout for new and exciting venues, ensuring our recommendations include the latest and greatest alongside the tried-and-true favorites. With In2Nightlife, you're not just going out; you're embarking on a nightlife adventure tailored just for you.</p>
              <p>Our application goes beyond simple suggestions. We offer detailed insights into each venue, including user reviews, ambiance type, dress code, and what to expect in terms of music and crowd. This way, you can make informed decisions and find places that resonate with your personal style and mood for the evening. Plus, with exclusive deals and VIP access options available through our app, your nights out will not only be unforgettable but also unbeatable in value.</p>
              <p>Community is at the heart of what we do. In2Nightlife encourages users to share their experiences and tips, creating a vibrant community of nightlife enthusiasts. Join us to share your unforgettable nights, connect with fellow party-goers, and discover the pulse of Calgary's nightlife scene together.</p>
              <p>Ready to explore? Let In2Nightlife be your guide to the best nights of your life. Download our app, set your preferences, and step into the vibrant world of Calgary's nightlife with confidence and excitement. It's time to experience what the night has to offer, and we can't wait to show you the way.</p>
            </div>
          </div>
        </div>
      </section>
      <hr />

      <section id="areas-of-service">
        <div className="container">
          <div className="row">           
            <div className="col-md-12">
              {/* Add the Carousel component */}
              <Carousel>
                {/* Add Carousel.Item for each image */}
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={aosImage1}
                    alt="First slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={aosImage2}
                    alt="Second slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={aosImage3}
                    alt="Third slide"
                  />
                </Carousel.Item>
              </Carousel>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutComponent;


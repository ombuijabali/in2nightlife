import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const FAQContainer = styled.div`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #0f0c29;
  padding: 40px;
  border-radius: 12px;
  max-width: 800px;
  margin: auto;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const FAQTitle = styled.h2`
  text-align: center;
  margin-bottom: 40px;
  font-size: 30px;
  font-weight: bold;
  color: #302b63;
`;

const FAQItemContainer = styled.div`
  margin-bottom: 30px;
  cursor: pointer;
  border-bottom: 2px solid #eee;
  padding-bottom: 20px;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: #302b63;
  }
`;

const FAQQuestion = styled.h3`
  font-size: 18px;
  color: #0f0c29;
  margin-bottom: 10px;
  text-align: left;
`;

const FAQAnswer = styled.p`
  font-size: 18px;
  color: #302b63;
  text-align: left;
`;

const BackButton = styled.button`
  position: absolute;
  bottom: 30px;
  right: 0px;
  background: 'linear-gradient(to right, #ff8800, #000000)'
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 18px;
  transition: background 0.3s ease;

  &:hover {
    background: #24243e;
  }
`;

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <FAQItemContainer onClick={toggleOpen}>
      <FAQQuestion>{question}</FAQQuestion>
      {isOpen && <FAQAnswer>{answer}</FAQAnswer>}
    </FAQItemContainer>
  );
};

const FAQsComponent = () => {
  const faqs = [
    {
      question: 'What time do the events usually start?',
      answer: 'Most events start at 10 PM, but times can vary. Check individual event listings for details.',
    },
    {
      question: 'Is there a dress code for events?',
      answer: 'Yes, there is usually a dress code. We recommend smart casual attire unless otherwise specified.',
    },
    {
      question: 'Are there any age restrictions?',
      answer: 'Yes, most events are 18+ or 21+, depending on the venue. Please check specific event details for information.',
    },
    // Add more FAQs here
  ];

  const navigate = useNavigate();
  const handleBackButtonClick = () => {
    navigate('/dashboard'); // Navigate back to the dashboard route
  };

  return (
    <FAQContainer>
      <FAQTitle>Frequently Asked Questions</FAQTitle>
      {faqs.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
      <BackButton onClick={handleBackButtonClick}>Back</BackButton>
    </FAQContainer>
  );
};

export default FAQsComponent;
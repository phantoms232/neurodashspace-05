import React from 'npm:react@18.3.1';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Img,
  Hr,
} from 'npm:@react-email/components@0.0.22';

interface WelcomeEmailProps {
  recipientName: string;
}

export const WelcomeEmail = ({ recipientName }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to NeuroDash - Your brain training journey starts now!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Img
            src="https://i.imgur.com/your-logo.png"
            width="120"
            height="40"
            alt="NeuroDash"
            style={logo}
          />
        </Section>
        
        <Heading style={h1}>Welcome to NeuroDash, {recipientName}! 🧠</Heading>
        
        <Text style={text}>
          Get ready to supercharge your cognitive abilities! You've just joined thousands of users 
          who are already enhancing their mental performance with our scientifically-backed brain training tests.
        </Text>

        <Section style={ctaSection}>
          <Button
            href="https://neurodash.app"
            style={button}
          >
            Start Your First Test
          </Button>
        </Section>

        <Text style={text}>
          <strong>What you can expect:</strong>
        </Text>
        
        <Section style={listSection}>
          <Text style={listItem}>🎯 <strong>Reaction Time Training</strong> - Sharpen your reflexes</Text>
          <Text style={listItem}>🧩 <strong>Memory Challenges</strong> - Boost your recall abilities</Text>
          <Text style={listItem}>⚡ <strong>Processing Speed Tests</strong> - Think faster than ever</Text>
          <Text style={listItem}>📊 <strong>Progress Tracking</strong> - Watch your improvement over time</Text>
        </Section>

        <Hr style={hr} />

        <Text style={text}>
          <strong>Pro tip:</strong> Take your first test now to establish your baseline. 
          Most users see improvements within just one week of regular training!
        </Text>

        <Section style={ctaSection}>
          <Button
            href="https://neurodash.app/tests"
            style={secondaryButton}
          >
            Browse All Tests
          </Button>
        </Section>

        <Text style={footer}>
          Questions? Just reply to this email - we're here to help!<br />
          <Link href="https://neurodash.app" style={link}>NeuroDash Team</Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#0a0a0b',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const headerSection = {
  textAlign: 'center' as const,
  padding: '20px 0',
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const text = {
  color: '#e5e5e5',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const secondaryButton = {
  backgroundColor: 'transparent',
  border: '1px solid #3b82f6',
  borderRadius: '8px',
  color: '#3b82f6',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const listSection = {
  margin: '20px 0',
};

const listItem = {
  color: '#e5e5e5',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const hr = {
  borderColor: '#333',
  margin: '32px 0',
};

const footer = {
  color: '#888',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '32px 0',
};

const link = {
  color: '#3b82f6',
  textDecoration: 'underline',
};

export default WelcomeEmail;
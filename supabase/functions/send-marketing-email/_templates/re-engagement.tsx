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
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface ReEngagementEmailProps {
  recipientName: string;
  lastActiveDate?: string;
  personalBest?: { testType: string; score: number; };
}

export const ReEngagementEmail = ({ 
  recipientName, 
  lastActiveDate,
  personalBest
}: ReEngagementEmailProps) => (
  <Html>
    <Head />
    <Preview>We miss you! Your brain training journey is waiting...</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Text style={missYouEmoji}>🤗</Text>
          <Heading style={h1}>We miss you, {recipientName}!</Heading>
        </Section>
        
        <Text style={text}>
          Your brain training streak is waiting for you to return! We noticed you haven't 
          been active recently, and we wanted to reach out because your cognitive journey matters to us.
        </Text>

        {lastActiveDate && (
          <Section style={statsCard}>
            <Text style={statLabel}>Last active:</Text>
            <Text style={statValue}>{lastActiveDate}</Text>
          </Section>
        )}

        {personalBest && (
          <Section style={achievementCard}>
            <Text style={achievementBadge}>🏆 YOUR PERSONAL BEST</Text>
            <Text style={achievementTitle}>{personalBest.testType}</Text>
            <Text style={achievementScore}>Score: {personalBest.score}</Text>
            <Text style={achievementText}>
              Think you can beat this record? Let's find out!
            </Text>
          </Section>
        )}

        <Section style={motivationSection}>
          <Text style={motivationTitle}>🧠 What you're missing:</Text>
          <Text style={motivationItem}>• New cognitive tests and challenges</Text>
          <Text style={motivationItem}>• Improved brain training algorithms</Text>
          <Text style={motivationItem}>• Community leaderboards and competitions</Text>
          <Text style={motivationItem}>• Advanced analytics and insights</Text>
        </Section>

        <Section style={ctaSection}>
          <Button
            href="https://neurodash.app"
            style={button}
          >
            Continue Your Journey
          </Button>
        </Section>

        <Text style={text}>
          <strong>Quick comeback tip:</strong> Start with just one test today. Research shows 
          that even a 2-minute brain training session can help maintain cognitive sharpness.
        </Text>

        <Hr style={hr} />

        <Section style={incentiveSection}>
          <Text style={incentiveTitle}>🎁 Welcome Back Bonus</Text>
          <Text style={incentiveText}>
            Come back within the next 7 days and unlock exclusive premium features for FREE! 
            This includes advanced analytics, unlimited tests, and priority support.
          </Text>
          
          <Section style={ctaSection}>
            <Button
              href="https://neurodash.app/welcome-back"
              style={secondaryButton}
            >
              Claim Bonus Now
            </Button>
          </Section>
        </Section>

        <Text style={footer}>
          Your brain is your most valuable asset - let's keep it sharp together!<br />
          <Link href="https://neurodash.app" style={link}>The NeuroDash Team</Link>
        </Text>

        <Text style={unsubscribe}>
          Not interested anymore? <Link href="https://neurodash.app/unsubscribe" style={unsubscribeLink}>Unsubscribe here</Link>
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

const missYouEmoji = {
  fontSize: '48px',
  margin: '0 0 20px 0',
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '20px 0',
};

const text = {
  color: '#e5e5e5',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const statsCard = {
  backgroundColor: '#1a1a1b',
  borderRadius: '8px',
  padding: '16px',
  textAlign: 'center' as const,
  margin: '24px 0',
};

const statLabel = {
  color: '#888',
  fontSize: '14px',
  margin: '0 0 4px 0',
};

const statValue = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
};

const achievementCard = {
  backgroundColor: '#1a1a1b',
  border: '2px solid #ffd700',
  borderRadius: '12px',
  padding: '24px',
  textAlign: 'center' as const,
  margin: '32px 0',
};

const achievementBadge = {
  backgroundColor: '#ffd700',
  color: '#000',
  fontSize: '12px',
  fontWeight: 'bold',
  padding: '4px 12px',
  borderRadius: '16px',
  display: 'inline-block',
  margin: '0 0 16px 0',
};

const achievementTitle = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '8px 0',
};

const achievementScore = {
  color: '#ffd700',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '8px 0',
};

const achievementText = {
  color: '#e5e5e5',
  fontSize: '14px',
  margin: '8px 0 0 0',
};

const motivationSection = {
  backgroundColor: '#1a1a1b',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const motivationTitle = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const motivationItem = {
  color: '#e5e5e5',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const incentiveSection = {
  backgroundColor: '#1a1a1b',
  borderRadius: '12px',
  padding: '24px',
  textAlign: 'center' as const,
  margin: '32px 0',
};

const incentiveTitle = {
  color: '#ffd700',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const incentiveText = {
  color: '#e5e5e5',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '24px 0',
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
  backgroundColor: '#ffd700',
  borderRadius: '8px',
  color: '#000',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const hr = {
  borderColor: '#333',
  margin: '32px 0',
};

const footer = {
  color: '#888',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '32px 0 16px 0',
};

const unsubscribe = {
  textAlign: 'center' as const,
  margin: '16px 0',
};

const link = {
  color: '#3b82f6',
  textDecoration: 'underline',
};

const unsubscribeLink = {
  color: '#666',
  fontSize: '12px',
  textDecoration: 'underline',
};

export default ReEngagementEmail;
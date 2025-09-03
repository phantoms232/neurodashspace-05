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
import * as React from 'npm:react@18.3.1';

interface AchievementEmailProps {
  recipientName: string;
  achievement: string;
  score?: number;
  testType?: string;
}

export const AchievementEmail = ({ 
  recipientName, 
  achievement, 
  score, 
  testType 
}: AchievementEmailProps) => (
  <Html>
    <Head />
    <Preview>🎉 Congratulations! You've unlocked a new achievement on NeuroDash</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={celebrationSection}>
          <Text style={celebrationEmoji}>🎉</Text>
          <Heading style={h1}>Congratulations, {recipientName}!</Heading>
        </Section>
        
        <Section style={achievementCard}>
          <Text style={achievementBadge}>🏆 NEW ACHIEVEMENT</Text>
          <Heading style={achievementTitle}>{achievement}</Heading>
          
          {score && testType && (
            <Text style={scoreText}>
              Score: <strong>{score}</strong> in {testType}
            </Text>
          )}
        </Section>

        <Text style={text}>
          Your dedication to brain training is paying off! This achievement shows you're making 
          real progress in enhancing your cognitive abilities.
        </Text>

        <Section style={statsSection}>
          <Text style={statsTitle}>Keep the momentum going:</Text>
          <Text style={statItem}>🔥 Take another test to maintain your streak</Text>
          <Text style={statItem}>📈 Check your progress dashboard</Text>
          <Text style={statItem}>🎯 Challenge yourself with harder tests</Text>
        </Section>

        <Section style={ctaSection}>
          <Button
            href="https://neurodash.app/tests"
            style={button}
          >
            Continue Training
          </Button>
        </Section>

        <Hr style={hr} />

        <Text style={text}>
          <strong>Share your success!</strong> Let your friends know about your achievement 
          and invite them to join NeuroDash. You'll both get premium features when they sign up!
        </Text>

        <Section style={ctaSection}>
          <Button
            href="https://neurodash.app/referral"
            style={secondaryButton}
          >
            Invite Friends
          </Button>
        </Section>

        <Text style={footer}>
          Keep up the great work!<br />
          <Link href="https://neurodash.app" style={link}>The NeuroDash Team</Link>
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

const celebrationSection = {
  textAlign: 'center' as const,
  padding: '20px 0',
};

const celebrationEmoji = {
  fontSize: '48px',
  margin: '0',
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '20px 0',
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
  color: '#ffd700',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '16px 0',
};

const scoreText = {
  color: '#e5e5e5',
  fontSize: '16px',
  margin: '8px 0',
};

const text = {
  color: '#e5e5e5',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const statsSection = {
  backgroundColor: '#1a1a1b',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const statsTitle = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const statItem = {
  color: '#e5e5e5',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
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

export default AchievementEmail;
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

interface WeeklyTipsEmailProps {
  recipientName: string;
  tips: Array<{ title: string; description: string; }>;
  featuredTest?: string;
}

export const WeeklyTipsEmail = ({ 
  recipientName, 
  tips = [],
  featuredTest = "Reaction Time Test"
}: WeeklyTipsEmailProps) => {
  const defaultTips = [
    {
      title: "Practice Makes Permanent",
      description: "Consistent daily practice, even just 5 minutes, builds stronger neural pathways than sporadic long sessions."
    },
    {
      title: "Sleep for Cognitive Performance",
      description: "Quality sleep consolidates learning and improves reaction time. Aim for 7-9 hours nightly."
    },
    {
      title: "Hydration Boosts Brain Function",
      description: "Even mild dehydration can impair cognitive performance. Keep water nearby during training."
    }
  ];

  const displayTips = tips.length > 0 ? tips : defaultTips;

  return (
    <Html>
      <Head />
      <Preview>Your weekly brain training tips from NeuroDash</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Weekly Brain Training Tips 🧠</Heading>
          <Text style={greeting}>Hi {recipientName},</Text>
          
          <Text style={text}>
            Ready to supercharge your cognitive performance this week? Here are three 
            evidence-based tips to maximize your brain training results:
          </Text>

          <Section style={tipsSection}>
            {displayTips.slice(0, 3).map((tip, index) => (
              <Section key={index} style={tipCard}>
                <Text style={tipNumber}>{index + 1}</Text>
                <Section style={tipContent}>
                  <Text style={tipTitle}>{tip.title}</Text>
                  <Text style={tipDescription}>{tip.description}</Text>
                </Section>
              </Section>
            ))}
          </Section>

          <Hr style={hr} />

          <Section style={featuredSection}>
            <Text style={featuredBadge}>⭐ FEATURED TEST</Text>
            <Heading style={featuredTitle}>{featuredTest}</Heading>
            <Text style={featuredDescription}>
              This week's spotlight test is perfect for improving your mental agility. 
              Challenge yourself and see how you compare to other users!
            </Text>
            
            <Section style={ctaSection}>
              <Button
                href="https://neurodash.app/tests"
                style={button}
              >
                Try Featured Test
              </Button>
            </Section>
          </Section>

          <Hr style={hr} />

          <Section style={challengeSection}>
            <Text style={challengeTitle}>🏆 Weekly Challenge</Text>
            <Text style={challengeText}>
              Complete 3 different cognitive tests this week to unlock the "Diverse Trainer" badge!
            </Text>
            <Text style={challengeProgress}>
              Track your progress and compete with friends.
            </Text>
          </Section>

          <Section style={ctaSection}>
            <Button
              href="https://neurodash.app"
              style={secondaryButton}
            >
              View Dashboard
            </Button>
          </Section>

          <Text style={footer}>
            Keep training, keep improving!<br />
            <Link href="https://neurodash.app" style={link}>The NeuroDash Team</Link>
          </Text>

          <Text style={unsubscribe}>
            <Link href="https://neurodash.app/unsubscribe" style={unsubscribeLink}>
              Unsubscribe from weekly tips
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#0a0a0b',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const greeting = {
  color: '#e5e5e5',
  fontSize: '18px',
  margin: '20px 0 10px 0',
};

const text = {
  color: '#e5e5e5',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const tipsSection = {
  margin: '32px 0',
};

const tipCard = {
  backgroundColor: '#1a1a1b',
  borderRadius: '8px',
  padding: '20px',
  margin: '16px 0',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
};

const tipNumber = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  borderRadius: '50%',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  margin: '0',
};

const tipContent = {
  flex: 1,
};

const tipTitle = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const tipDescription = {
  color: '#e5e5e5',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const featuredSection = {
  backgroundColor: '#1a1a1b',
  borderRadius: '12px',
  padding: '24px',
  textAlign: 'center' as const,
  margin: '32px 0',
};

const featuredBadge = {
  backgroundColor: '#ffd700',
  color: '#000',
  fontSize: '12px',
  fontWeight: 'bold',
  padding: '4px 12px',
  borderRadius: '16px',
  display: 'inline-block',
  margin: '0 0 16px 0',
};

const featuredTitle = {
  color: '#ffffff',
  fontSize: '22px',
  fontWeight: 'bold',
  margin: '16px 0',
};

const featuredDescription = {
  color: '#e5e5e5',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const challengeSection = {
  backgroundColor: '#1a1a1b',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const challengeTitle = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const challengeText = {
  color: '#e5e5e5',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const challengeProgress = {
  color: '#888',
  fontSize: '14px',
  margin: '8px 0 0 0',
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

export default WeeklyTipsEmail;
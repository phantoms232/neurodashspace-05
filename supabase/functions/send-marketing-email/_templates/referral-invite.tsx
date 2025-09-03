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
  Hr,
} from 'npm:@react-email/components@0.0.22';

interface ReferralInviteEmailProps {
  recipientName: string;
  referralCode: string;
  referrerName: string;
}

export const ReferralInviteEmail = ({ 
  recipientName, 
  referralCode,
  referrerName
}: ReferralInviteEmailProps) => (
  <Html>
    <Head />
    <Preview>{referrerName} invited you to join NeuroDash - Get 7 days free premium!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Text style={giftEmoji}>🎁</Text>
          <Heading style={h1}>You're Invited to NeuroDash!</Heading>
        </Section>
        
        <Text style={text}>
          Hi {recipientName},
        </Text>
        
        <Text style={text}>
          Great news! <strong>{referrerName}</strong> thinks you'd love NeuroDash, 
          our brain training platform that's helping thousands of people enhance their 
          cognitive abilities.
        </Text>

        <Section style={referralCard}>
          <Text style={referralBadge}>🚀 SPECIAL INVITATION</Text>
          <Text style={referralTitle}>7 Days Premium FREE</Text>
          <Text style={referralCode}>Code: {referralCode}</Text>
          <Text style={referralDescription}>
            Use this exclusive code to unlock premium features at no cost!
          </Text>
        </Section>

        <Section style={benefitsSection}>
          <Text style={benefitsTitle}>What you'll get with Premium:</Text>
          <Text style={benefitItem}>🧠 <strong>Unlimited brain tests</strong> - No daily limits</Text>
          <Text style={benefitItem}>📊 <strong>Advanced analytics</strong> - Track detailed progress</Text>
          <Text style={benefitItem}>⚡ <strong>Exclusive tests</strong> - Access premium cognitive challenges</Text>
          <Text style={benefitItem}>🏆 <strong>Achievement system</strong> - Unlock special badges</Text>
          <Text style={benefitItem}>📈 <strong>Performance insights</strong> - Personalized improvement tips</Text>
        </Section>

        <Section style={ctaSection}>
          <Button
            href={`https://neurodash.app/signup?ref=${referralCode}`}
            style={button}
          >
            Start Free Premium Trial
          </Button>
        </Section>

        <Text style={text}>
          <strong>Why brain training matters:</strong>
        </Text>
        
        <Text style={text}>
          Research shows that regular cognitive training can improve reaction time, 
          memory, and mental processing speed. Join {referrerName} and thousands of 
          others who are already seeing results!
        </Text>

        <Hr style={hr} />

        <Section style={socialProofSection}>
          <Text style={socialProofTitle}>🌟 What our users say:</Text>
          <Text style={testimonial}>
            "I improved my reaction time by 15% in just two weeks!" - Sarah M.
          </Text>
          <Text style={testimonial}>
            "The progress tracking keeps me motivated every day." - David L.
          </Text>
          <Text style={testimonial}>
            "Finally, a brain training app that actually works!" - Emily R.
          </Text>
        </Section>

        <Section style={urgencySection}>
          <Text style={urgencyTitle}>⏰ Limited Time Offer</Text>
          <Text style={urgencyText}>
            This referral code expires in 30 days. Don't miss out on your free premium trial!
          </Text>
        </Section>

        <Section style={ctaSection}>
          <Button
            href={`https://neurodash.app/signup?ref=${referralCode}`}
            style={secondaryButton}
          >
            Claim Your Free Trial
          </Button>
        </Section>

        <Text style={footer}>
          Questions? Just reply to this email - we're here to help!<br />
          <Link href="https://neurodash.app" style={link}>The NeuroDash Team</Link>
        </Text>

        <Text style={unsubscribe}>
          This invitation was sent by {referrerName}. 
          <Link href="https://neurodash.app/unsubscribe" style={unsubscribeLink}>Unsubscribe from referral emails</Link>
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

const giftEmoji = {
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

const referralCard = {
  backgroundColor: '#1a1a1b',
  border: '2px solid #3b82f6',
  borderRadius: '12px',
  padding: '24px',
  textAlign: 'center' as const,
  margin: '32px 0',
};

const referralBadge = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: 'bold',
  padding: '4px 12px',
  borderRadius: '16px',
  display: 'inline-block',
  margin: '0 0 16px 0',
};

const referralTitle = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '16px 0',
};

const referralCode = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: 'bold',
  padding: '12px 24px',
  borderRadius: '8px',
  display: 'inline-block',
  margin: '16px 0',
  letterSpacing: '2px',
};

const referralDescription = {
  color: '#e5e5e5',
  fontSize: '14px',
  margin: '16px 0 0 0',
};

const benefitsSection = {
  backgroundColor: '#1a1a1b',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const benefitsTitle = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const benefitItem = {
  color: '#e5e5e5',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const socialProofSection = {
  backgroundColor: '#1a1a1b',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const socialProofTitle = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const testimonial = {
  color: '#e5e5e5',
  fontSize: '14px',
  fontStyle: 'italic',
  lineHeight: '20px',
  margin: '8px 0',
  borderLeft: '3px solid #3b82f6',
  paddingLeft: '12px',
};

const urgencySection = {
  backgroundColor: '#1a1a1b',
  border: '1px solid #ffd700',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center' as const,
  margin: '24px 0',
};

const urgencyTitle = {
  color: '#ffd700',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const urgencyText = {
  color: '#e5e5e5',
  fontSize: '16px',
  margin: '0',
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

export default ReferralInviteEmail;
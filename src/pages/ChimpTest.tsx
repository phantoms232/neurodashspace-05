import { ChimpTest } from "@/components/ChimpTest";
import { SEOHead } from "@/components/SEOHead";

const ChimpTestPage = () => {
  return (
    <>
      <SEOHead
        title="Chimp Test Online - Can You Beat a Chimpanzee's Memory? | NeuroDash"
        description="Take the famous chimp test online for free. Challenge your working memory against a chimpanzee's abilities. Test your numerical sequencing and cognitive speed like on BBC's Human Planet."
        canonical="https://neurodash.space/chimptest"
        keywords="chimp test, chimpanzee test online, famous chimp test, working memory test, numerical sequencing, cognitive comparison, memory challenge, human vs chimp, BBC chimp test, primate intelligence test"
        schemaData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "name": "Chimp Test Online",
              "description": "Take the famous chimp test to compare your working memory against a chimpanzee's abilities",
              "url": "https://neurodash.space/chimptest",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is the chimp test?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The chimp test is a famous cognitive test where you must remember the positions of numbers 1-9 and click them in order. It became famous after showing chimpanzees can outperform humans."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can humans beat chimpanzees at the chimp test?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Most humans cannot beat chimpanzees at this test. Chimpanzees have exceptional working memory for this specific task, often completing it faster than humans."
                  }
                }
              ]
            }
          ]
        }}
      />
      <div className="min-h-screen neural-grid bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4">
        <ChimpTest />
      </div>
    </>
  );
};

export default ChimpTestPage;
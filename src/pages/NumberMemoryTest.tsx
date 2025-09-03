import { NumberMemoryTest } from "@/components/NumberMemoryTest";
import { SEOHead } from "@/components/SEOHead";

const NumberMemoryTestPage = () => {
  return (
    <>
      <SEOHead
        title="Free Number Memory Test Online - Test Your Digit Recall | NeuroDash"
        description="Take the free number memory test online. Challenge your digit recall and short-term memory with increasingly difficult number sequences. Improve your numerical memory and cognitive abilities."
        canonical="https://neurodash.space/numbermemory"
        keywords="number memory test, free memory test online, digit recall test, short term memory test, numerical memory, brain training, memory assessment, digit span test, working memory test"
        schemaData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "name": "Free Number Memory Test",
              "description": "Test your number memory and digit recall abilities with increasingly challenging sequences",
              "url": "https://neurodash.space/numbermemory",
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
                  "name": "What is number memory?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Number memory is your ability to remember and recall sequences of digits. It tests your working memory and short-term memory capacity."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How many digits can the average person remember?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The average person can remember 7±2 digits in their short-term memory, known as Miller's Magic Number."
                  }
                }
              ]
            }
          ]
        }}
      />
      <div className="min-h-screen neural-grid bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4">
        <NumberMemoryTest />
      </div>
    </>
  );
};

export default NumberMemoryTestPage;
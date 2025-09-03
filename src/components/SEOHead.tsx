import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  schemaData?: object;
}

export const SEOHead = ({
  title = "NeuroDash - Free Brain Training & Cognitive Assessment Tests",
  description = "Test your cognitive abilities with 15+ free brain training games. Measure reaction time, memory, attention, and more. Compare scores with others and track your progress.",
  keywords = "brain training, cognitive test, memory test, reaction time, attention test, IQ test, mental fitness, cognitive assessment",
  canonical = "https://neurodash.space",
  ogImage = "https://neurodash.space/lovable-uploads/92547e9c-22c3-4aab-ae1f-46223bd5de1b.png",
  schemaData
}: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    }
    
    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonical);
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', canonical);
      document.head.appendChild(canonicalLink);
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', description);
    
    const ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (ogImageMeta) ogImageMeta.setAttribute('content', ogImage);
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonical);
    
    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', title);
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', description);
    
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) twitterImage.setAttribute('content', ogImage);
    
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute('content', canonical);
    
    // Add structured data if provided
    if (schemaData) {
      let schemaScript = document.querySelector('#dynamic-schema') as HTMLScriptElement;
      if (schemaScript) {
        schemaScript.remove();
      }
      
      const newSchemaScript = document.createElement('script') as HTMLScriptElement;
      newSchemaScript.id = 'dynamic-schema';
      newSchemaScript.type = 'application/ld+json';
      newSchemaScript.textContent = JSON.stringify(schemaData);
      document.head.appendChild(newSchemaScript);
    }
  }, [title, description, keywords, canonical, ogImage, schemaData]);
  
  return null; // This component doesn't render anything
};
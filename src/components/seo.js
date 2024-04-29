import React from 'react';
import { useSiteMetadata } from '../hooks/useSiteMetadata';

export const Seo = ({ title, description, ogpImage, lang, children }) => {
  const { title: defaultTitle, description: defaultDescription, siteUrl: defaultSiteUrl, logoImage: defaultOgpImage, lang: defaultLang} =
    useSiteMetadata();

  const seo = {
    title: title ? `${title} | ${defaultTitle}` : defaultTitle,
    description: description || defaultDescription,
    ogpImage: ogpImage || defaultOgpImage,
    lang: lang || defaultLang,
    ogpImage: ogpImage ? (defaultSiteUrl+ogpImage) : defaultOgpImage,
  };

  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description}/>
      <meta lang={seo.lang}/>
      <meta property="og:title" content={seo.title}/>
      <meta property="og:description" content={seo.description}/>
      <meta property="og:image" content={seo.ogpImage}/>
      <meta property="og:type" content="website"/>
      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:title" content={seo.title}/>
      <meta name="twitter:description" content={seo.description}/>
      <meta name="twitter:image" content={seo.ogpImage}/>
      {children}
    </>
  );
};
import React from 'react';
import { useSiteMetadata } from '../hooks/useSiteMetadata';

export const Seo = ({ title, description, lang, children }) => {
  const { title: defaultTitle, description: defaultDescription , lang: defaultLang} =
    useSiteMetadata();

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    lang: lang || defaultLang,
  };

  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} lang={seo.lang}/>
      {children}
    </>
  );
};
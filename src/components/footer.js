import * as React from 'react';

const Footer = () => {
  return (
    <footer>
      <p className='text-center mt-5'>© 気ままな備忘録 {new Date().getFullYear()}</p>
    </footer>
  );
};

export default Footer;
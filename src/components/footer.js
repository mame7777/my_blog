import * as React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="text-center  mt-5">
      <a href="/privacy-policy">プライバシーポリシー・免責事項ほか</a>
      <p className='text-center'>© 気ままな備忘録 2022-{new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
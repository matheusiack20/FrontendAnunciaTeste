import React from 'react';

const Footer = () => {
  return (
    <footer className=" w-full p-2 bg-[#dafd00] shadow md:flex md:items-center md:justify-between dark:bg-gray-800 dark:border-gray-600">
      <span className="flex gap-2 text-sm text-black sm:text-center dark:text-gray-400">
        © {new Date().getFullYear()} <p> AnuncIA</p>. All Rights Reserved.
      </span>
      <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-black dark:text-gray-400 sm:mt-0">
        <li>
          <a href="#" className="hover:underline me-4 md:me-6">
            About
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline me-4 md:me-6">
            Privacy Policy
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline me-4 md:me-6">
            Cookies Policy
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline me-4 md:me-6">
            Licensing
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            Contact
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;

const Footer = ({ darkMode }) => {
  return (
    <footer className={`fixed bottom-0 w-full p-4 text-center transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-600'
    }`}>
      © 2025 Echo. All rights reserved.
    </footer>
  );
};

export default Footer;
import React from "react";
import { IoClose } from "react-icons/io5";
import PropTypes from "prop-types";

const Modal = ({ isOpen, children, closeModal }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed w-full h-screen z-50 left-0 top-0 bg-black bg-opacity-80 flex justify-center items-center transition-opacity duration-300"
      aria-hidden={!isOpen}
    >
      <div className="relative bg-red-400 p-6 rounded-lg shadow-lg max-w-lg ">
        {/* Modal content */}
        {children}

        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 text-[30px] text-gray-700 hover:text-red-500 transition-colors duration-200"
          aria-label="Close modal"
        >
          <IoClose />
        </button>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default Modal;

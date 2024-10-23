import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { RiHome6Fill } from "react-icons/ri";
import { FaUserLarge } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import Modal from "../Modal/Modal";
import Form from "../Posts/Form";
import { useAuthenticator } from "@aws-amplify/ui-react";

const Aside = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut } = useAuthenticator();

  // Handle modal state
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handle menu state for mobile
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Modal Component */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} closeModal={closeModal}>
          <Form />
        </Modal>
      )}

      {/* Hamburger Button for Mobile */}
      <div className="lg:hidden p-4">
        <button
          onClick={toggleMenu}
          className="text-gray-700 focus:outline-none"
          aria-label="Toggle navigation"
        >
          <GiHamburgerMenu size={24} />
        </button>
      </div>

      {/* Aside Navigation */}
      <aside
        className={`border-r min-h-screen h-full p-4 bg-gray-100 fixed lg:relative z-50 lg:translate-x-0 transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:w-60 w-64`}
      >
        {/* Close Menu for Mobile */}
        <button
          className="lg:hidden mb-4 text-gray-600"
          onClick={toggleMenu}
          aria-label="Close navigation"
        >
          X
        </button>

        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <img
            className="h-12 w-auto"
            src="/asset/logo.png"
            alt="Site Logo"
            aria-label="Company logo"
          />
        </div>

        {/* Navigation Links */}
        <nav aria-label="Main navigation">
          <ul className="space-y-6">
            {/* Home Link */}
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg transition-colors 
                   ${
                     isActive
                       ? "text-black"
                       : "text-gray-500 hover:text-gray-800"
                   }`
                }
                aria-label="Home"
              >
                <RiHome6Fill size={22} />
                <span>Accueil</span>
              </NavLink>
            </li>

            {/* Profile Link */}
            <li>
              <NavLink
                to="/profil"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg transition-colors 
                   ${
                     isActive
                       ? "text-black"
                       : "text-gray-500 hover:text-gray-800"
                   }`
                }
                aria-label="Profile"
              >
                <FaUserLarge size={20} />
                <span>Profil</span>
              </NavLink>
            </li>

            {/* Create Post Button */}
            <li>
              <button
                onClick={openModal}
                className="w-full flex justify-center items-center gap-2 py-2 px-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                aria-label="Create Post"
              >
                Créer un post
              </button>
            </li>

            {/* Logout Button */}
            <li>
              <button
                onClick={signOut}
                className="w-full flex justify-center items-center gap-2 py-2 px-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors"
                aria-label="Sign out"
              >
                Déconnexion
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay for Mobile when Menu is Open */}
      {isMenuOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black opacity-50 lg:hidden z-40"
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};

export default Aside;

import { FaInstagram, FaFacebook } from "react-icons/fa";

export default function SocialIcons() {
    return (
        <div className="flex justify-center items-center mb-4">
            <p className="flex flex-wrap items-center space-x-2">
                Connect with us on&nbsp;
                <a
                  href="https://www.instagram.com/townsvilletidy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline cursor-pointer flex items-center space-x-1"
                >
                  <FaInstagram />
                  <span>Instagram</span>
                </a>
                &nbsp;and&nbsp;
                <a
                  href="https://www.facebook.com/groups/1044042929275742/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline cursor-pointer flex items-center space-x-1"
                  style={{ marginLeft: 0 }}
                >
                  <FaFacebook />
                  <span>Facebook</span>
                </a>
                !
            </p>
        </div>
    );
};

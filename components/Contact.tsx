import Link from 'next/link';
import SocialIcons from './SocialIcons';

export default function Contact() {
    return (
        <div className="contact text-center mt-6">
            <SocialIcons />
            <p className="text-gray-700">
                Contact us at <Link href="mailto:tidytsv@gmail.com" className="text-green-600 hover:text-green-800 underline">tidytsv@gmail.com</Link>
            </p>
        </div>
    );
}
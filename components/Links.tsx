import Link from 'next/link';

export default function Links() {
    return (
        <>
            <div className="social-links flex flex-wrap justify-center items-center gap-4 mt-4">
                <Link 
                    href="https://www.facebook.com/groups/1044042929275742/" 
                    target="_blank" 
                    className="text-blue-500 hover:text-blue-700 underline"
                >
                    TIDY Up Townsville Facebook group
                </Link>
                <Link 
                    href="https://www.facebook.com/TidyUpTSV" 
                    target="_blank" 
                    className="text-blue-500 hover:text-blue-700 underline"
                >
                    TIDY Up Townsville Facebook page
                </Link>
                <Link 
                    href="https://www.instagram.com/townsvilletidy/" 
                    target="_blank" 
                    className="text-blue-500 hover:text-blue-700 underline"
                >
                    TIDY Up Townsville Instagram profile
                </Link>
                <Link 
                    href="https://www.facebook.com/profile.php?id=100080361439968" 
                    target="_blank" 
                    className="text-blue-500 hover:text-blue-700 underline"
                >
                    TIDY Up Charters Towers Facebook page
                </Link>
                <Link 
                    href="https://www.facebook.com/groups/598918515686528/" 
                    target="_blank" 
                    className="text-blue-500 hover:text-blue-700 underline"
                >
                    TIDY Up The Northern Territory Facebook group
                </Link>
                <Link 
                    href="https://www.facebook.com/groups/306721937452648/" 
                    target="_blank" 
                    className="text-blue-500 hover:text-blue-700 underline"
                >
                    TIDY Up Victoria Facebook group
                </Link>
                <Link 
                    href="https://www.facebook.com/groups/715453689381622/" 
                    target="_blank" 
                    className="text-blue-500 hover:text-blue-700 underline"
                >
                    The Townsville 3 Rivers Cleanup Campaign Facebook group - This group is for the cleanup and preservation of Townsville&apos;s 3 iconic rivers
                </Link>
                <Link 
                    href="https://www.facebook.com/groups/3709421559370480/" 
                    target="_blank" 
                    className="text-blue-500 hover:text-blue-700 underline"
                >
                    TIDY Up Tassie Facebook group
                </Link>
            </div>

            <div className="contact text-center mt-6">
                <p className="text-gray-700">
                Contact us at: <Link href="mailto:tidytsv@gmail.com" className="text-green-600 hover:text-green-800 underline">tidytsv@gmail.com</Link>
                </p>
            </div>
        </>
    );
}
import Link from 'next/link';
import Image from 'next/image';
import FacebookPosts from '@/components/FacebookPosts';
import Links from '@/components/Links';
import Contact from '@/components/Contact';

export const revalidate = 3600; //86400; // Revalidate once a day (in seconds)

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6 space-y-6">
        <Image 
          src="/images/TIDY-Up-Townsville-Logo-1.png"
          alt="Tidy Up Townsville"
          width={324}
          height={100}
          className="rounded-lg mx-auto w-full sm:w-auto"
        />
        <Links />
        <h1 className="text-3xl font-bold text-center text-green-600">TIDY Up</h1>
        <p className="text-xl text-center text-gray-700">
          Townsville Illegal Dumping Yobo&apos;s Clean-ups
        </p>
        <div className="mission bg-gray-50 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Mission Statement</h2>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            The purpose of this site is to raise awareness and try and combat Illegal Dumping in Townsville. I also want
            to clean it up; I see it as everyone&apos;s problem, not just a council problem. The town is growing, the escape
            areas are shrinking, and landholders are locking up because of the grubs. This dumping will ultimately impact 
            future generations. The people that dump aren&apos;t poor; they can afford throwaway items, fuel, a car, and they can dump. 
            If they can afford this, as well as a carton and a pack of durries, they can afford the tip. Ultimately, I want this environmental 
            crime wave punishable. I also see a need for further large-scale transfer stations in growth areas and the return of dump vouchers 
            which may well alleviate the problem. I encourage anyone and everyone to contact the council, state, and federal MP&apos;s
            and let them know we need support to combat this environmental crime wave.
            <br />
            - Dave Dudley
          </p>
        </div>
        <Contact />
        <div className="text-center space-y-6 p-6 bg-gray-50 rounded-lg shadow-md max-w-lg mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Related Links</h2>
          <ul className="space-y-6">
            <li className="bg-white p-4 rounded-md shadow flex flex-col items-start">
              <Link href="https://www.abc.net.au/news/2020-06-05/test-illegal-dumping-community/12042764" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2 2a1 1 0 001.414-1.414L11 10.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-medium">Townsville yobbos&apos; illegal dumping tackled by community clean-up group</span>
              </Link>
              <span className="text-sm text-gray-500 mt-2">ABC News</span>
            </li>
            <li className="bg-white p-4 rounded-md shadow flex flex-col items-start">
              <Link href="https://www.facebook.com/watch/?v=2811958278925996" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2 2a1 1 0 001.414-1.414L11 10.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-medium">Have you noticed any illegal dumping?</span>
              </Link>
              <span className="text-sm text-gray-500 mt-2">ABC North Queensland</span>
            </li>
            <li className="bg-white p-4 rounded-md shadow flex flex-col items-start">
              <Link href="https://climatesafety.info/thesustainablehour501/" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2 2a1 1 0 001.414-1.414L11 10.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-medium">Encouraging people to do the right thing</span>
              </Link>
              <span className="text-sm text-gray-500 mt-2">Centre for Climate Safety</span>
            </li>
            <li className="bg-white p-4 rounded-md shadow flex flex-col items-start">
              <Link href="https://wanderstories.space/leave-no-trace/" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2 2a1 1 0 001.414-1.414L11 10.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-medium">How to Leave No Trace</span>
              </Link>
              <span className="text-sm text-gray-500 mt-2">Wanderstories</span>
            </li>
          </ul>
        </div>
        <FacebookPosts />
        <Image 
          src="/images/TIDY-Up-Townsville-3-original.jpg"
          alt="Illegal dumping in Townsville"
          width={500}
          height={500}
          className="rounded-lg mx-auto w-full sm:w-auto"
        />
        <div className="text-center text-gray-500 text-sm">
          Built by <Link href="https://wanderstories.space/author/luen/">Luen Warneke</Link> &copy; {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}

import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 86400; // Revalidate once a day (in seconds)

export default async function Home() {
  const { takeScreenshot } = await import('../lib/screenshot');
  const screenshotBuffer = await takeScreenshot('https://www.facebook.com/groups/1044042929275742');
  const base64Image = screenshotBuffer.toString('base64');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-green-600">TIDY</h1>
        <p className="text-xl text-center text-gray-700">Townsville Illegal Dumping Yobo&apos;s Clean-ups</p>
        
        <div className="mission bg-gray-50 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Mission Statement:</h2>
          <p className="text-gray-600 leading-relaxed">
            The purpose of this site is to raise awareness and try and combat Illegal Dumping in Townsville. I also want
            to clean it up; I see it as everyone&apos;s problem, not just a council problem. The town is growing, the escape
            areas are shrinking, and landholders are locking up because of the grubs. This dumping will ultimately impact 
            future generations. The people that dump aren&apos;t poor; they can afford throwaway items, fuel, a car, and they can dump. 
            If they can afford this, as well as a carton and a pack of durries, they can afford the tip. Ultimately, I want this environmental 
            crime wave punishable. I also see a need for further large-scale transfer stations in growth areas and the return of dump vouchers 
            which may well alleviate the problem. I encourage anyone and everyone to contact the council, state, and federal MP&apos;s
            and let them know we need support to combat this environmental crime wave.
          </p>
        </div>

        <div className="social-links flex flex-wrap justify-center items-center gap-4 mt-4">
          <Link 
            href="https://www.facebook.com/groups/1044042929275742/" 
            target="_blank" 
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Townsville Facebook Group
          </Link>
          <Link 
            href="https://www.facebook.com/TidyUpTSV" 
            target="_blank" 
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Townsville Facebook Page
          </Link>
          <Link 
            href="https://www.facebook.com/profile.php?id=100080361439968" 
            target="_blank" 
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Charters Towers Facebook Page
          </Link>
          <Link 
            href="https://www.instagram.com/townsvilletidy/" 
            target="_blank" 
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Instagram
          </Link>
        </div>

        <div className="contact text-center mt-6">
          <p className="text-gray-700">
            Contact us at: <Link href="mailto:tidytsv@gmail.com" className="text-green-600 hover:text-green-800 underline">tidytsv@gmail.com</Link>
          </p>
        </div>

        <div className="mt-6">
          <Image
            src={`data:image/png;base64,${base64Image}`}
            alt="Screenshot"
            width={800}
            height={600}
            className="rounded-lg shadow-md mx-auto"
          />
        </div>
      </div>
    </div>
  );
}

import Image from 'next/image';
import { takeScreenshot } from '../lib/screenshot';

export const revalidate = 86400; // Revalidate once a day (in seconds)

export default async function Home() {
  const screenshotBuffer = await takeScreenshot('https://example.com');
  const base64Image = screenshotBuffer.toString('base64');

  return (
    <div>
      <h1>Screenshot of example.com</h1>
      <Image
        src={`data:image/png;base64,${base64Image}`}
        alt="Screenshot of example.com"
        width={800}
        height={600}
      />
    </div>
  );
}

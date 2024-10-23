import Image from 'next/image';
import { takeScreenshot } from '../lib/screenshot';

export const revalidate = 86400; // Revalidate once a day (in seconds)

export default async function Home() {
  const screenshotBuffer = await takeScreenshot('https://example.com');
  const base64Image = screenshotBuffer.toString('base64');

  return (
    <div>
      <h1>TIDY</h1>
      <p>Townsville Illegal Dumping Yobo&apos;s Clean-ups</p>
      <div className="mission">
          <p>Mission Statement:</p>
          <p>The purpose of this site is to raise awareness and try and combat Illegal Dumping in Townsville. I also want
              to clean it up, I see it as everyone&apos;s problem not just a council problem. The town is growing the escape
              areas are shrinking and landholders are locking up and that is because of the grubs, This dumping will
              ultimately impact future generations. The people that dump aren&apos;t poor, they can afford throw away items
              they can afford fuel, a car and they can dump. If they can afford this as well as a carton and a pack of
              durries they can afford the tip. Ultimately I want this environmental crime wave punishable. I also see a
              need for further large scale transfer stations in growth areas and the return of dump vouchers which may
              well alleviate the problem. I encourage anyone and everyone to contact the council, state and federal MP&apos;s
              and let them know we need support to combat this environmental crime wave.</p>
      </div>
      <div className="social-links">
          <a href="https://www.facebook.com/groups/1044042929275742/" target="_blank">Townsville Facebook Group</a> |
          <a href="https://www.facebook.com/TidyUpTSV" target="_blank">Townsville Facebook Page</a> |
          <a href="https://www.facebook.com/profile.php?id=100080361439968" target="_blank">Charters Towers Facebook
              Page</a> |
          <a href="https://www.instagram.com/townsvilletidy/" target="_blank">Instagram</a>
      </div>
      <div className="contact">
          <p>Contact us at: <a href="mailto:tidytsv@gmail.com">tidytsv@gmail.com</a></p>
      </div>
      <h1>Test Screenshot</h1>
      <Image
        src={`data:image/png;base64,${base64Image}`}
        alt="Screenshot"
        width={800}
        height={600}
      />
    </div>
  );
}

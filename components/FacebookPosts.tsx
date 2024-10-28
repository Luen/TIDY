import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'
import { unstable_cache } from 'next/cache';

interface Post {
  author: string;
  content: string;
  imageUrl?: string;
}

function PostCard({ post }: { post: Post }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback>{post.author[0]}</AvatarFallback>
          </Avatar>
          <CardTitle>{post.author}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{post.content}</p>
        {post.imageUrl && !post.imageUrl.includes('data:image/svg+xml') && (
          <Image 
            src={post.imageUrl} 
            alt="Facebook Post image" 
            className="w-full h-auto rounded-md"
            width={400}
            height={400}
          />
        )}
      </CardContent>
    </Card>
  )
}

const scrapeCachedPosts = unstable_cache(async () => {
  const { scrapeFacebookGroup } = await import('@/lib/scrapeFacebookGroup');
  return await scrapeFacebookGroup('https://www.facebook.com/groups/1044042929275742');
}, [], { revalidate: 86400 });


export default async function FacebookPosts() {
  const { buffer, posts } = await scrapeCachedPosts();
  const base64Image = buffer.toString('base64');

  return (
    <>
      <div className="max-w-2xl mx-auto p-4">
        {posts.map((post, index) => (
            <PostCard key={index} post={post} />
        ))}
      </div>
      <div className="relative mt-6 w-full sm:w-[800px] h-auto overflow-hidden mx-auto">
        <Image
            src={`data:image/png;base64,${base64Image}`}
            alt="Tidy Up Townsville Facebook group"
            width={800}
            height={700}
            className="absolute top-[-40px] left-0 w-full sm:w-auto"
        />
      </div>
    </>
  )
}
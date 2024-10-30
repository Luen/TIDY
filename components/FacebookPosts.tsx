import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'
import { unstable_cache } from 'next/cache';

interface Post {
  postLink: string;
  author: string;
  content: string;
  time: string;
  imageUrls?: string[];
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
          <p className="text-gray-500">{post.time}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{post.content}</p>
        {post.imageUrls && post.imageUrls.map((image, index) => (
          <Image 
            key={index}
            src={image} 
            alt="Facebook Post image" 
            className="rounded-lg mb-4"
            width={200}
            height={200}
          />
        ))}
      </CardContent>
    </Card>
  )
}

const scrapeCachedPosts = unstable_cache(async () => {
  const { scrapeFacebookGroup } = await import('@/lib/scrapeFacebookGroup');
  return await scrapeFacebookGroup('https://www.facebook.com/groups/1044042929275742');
}, [], { revalidate: 3600 }); // 86400


export default async function FacebookPosts() {
  const { posts } = await scrapeCachedPosts();

  return (
    <div className="max-w-2xl mx-auto p-4">
      {posts.map((post, index) => (
          <PostCard key={index} post={post} />
      ))}
    </div>
  )
}
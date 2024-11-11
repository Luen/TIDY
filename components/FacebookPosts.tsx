import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'
import { unstable_cache } from 'next/cache';

interface Post {
  postLink: string;
  author: string;
  content: string;
  timestamp: string;
  imageUrls?: string[];
}

function formatDistanceToNow(date: Date) {
  const diff = Date.now() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
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
          <span className="text-gray-500 text-sm">{formatDistanceToNow(new Date(parseInt(post.timestamp) * 1000))} ago</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{post.content}</p>
        <div className={`grid gap-2 ${post.imageUrls?.length === 1 ? 'grid-cols-1' : post.imageUrls?.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {post.imageUrls?.map((url, index) => {
          //const filename = encodeURIComponent(url)+'.jpg';
          //src={/images/${filename}}
          return (
            <Image 
              key={index}
              src={url}
              alt="Post image"
              width={200}
              height={200}
            />
          );
        })}
        </div>
        {post.postLink && (
          <a href={post.postLink} target="_blank" className="text-blue-500 hover:underline">View on Facebook</a>
        )}
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
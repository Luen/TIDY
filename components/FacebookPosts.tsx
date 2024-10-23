import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'

export const revalidate = 86400; // Revalidate once a day (in seconds)

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
        {post.imageUrl && (
          <Image 
            src={post.imageUrl} 
            alt="Post image" 
            className="w-full h-auto rounded-md"
            width={400}
            height={400}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default async function FacebookPosts() {
    const { scrapeFacebookGroup } = await import('../lib/scrapeFacebookGroup');
    const { buffer, posts}  = await scrapeFacebookGroup('https://www.facebook.com/groups/1044042929275742');
    const base64Image = buffer.toString('base64');
  return (
    <>
        <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Facebook Group Feed</h1>
        {posts.map((post, index) => (
            <PostCard key={index} post={post} />
        ))}
        </div>
        <div className="mt-6">
            <Image
            src={`data:image/png;base64,${base64Image}`}
            alt="Tidy Up Townsville Facebook group"
            width={800}
            height={600}
            className="rounded-lg shadow-md mx-auto"
            />
        </div>
    </>
  )
}
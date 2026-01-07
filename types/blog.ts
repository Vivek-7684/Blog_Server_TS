export interface Blog {
    blog_id:number,
    title:string,
    blog_content:string,
    blog_image:string,
    created_at:string,
    quote:string | null,
    summary:string | null,
    tags:string | null,
    author:string,
    author_image:string,
    author_desc:string,
    occupation:string,
    views:number,
    section_id:number,
    sub_title:string,
    section_content:string,
    section_image:string
}

export interface BlogsMap {
  [blogId: number]: {
    blog_id: number;
    title: string;
    content: string;
    image_url: string;
    created_at: string;
    tags: string | null;
    quote: string | null;
    summary: string | null;
    author: string;
    occupation: string;
    author_image: string;
    author_desc: string;
    views: number;
    sections: {
      section_id: number;
      sub_title: string | null;
      content: string | null;
      image_url: string | null;
    }[];
  };
}

const blogsMap: BlogsMap = {};

import { Link } from "react-router-dom";
export default function Bloglist({ blogs }) {
  console.log(blogs);
  return (
    <ul>
      {blogs
        .toSorted((blogfirst, blogsecond) => {
          console.log(blogfirst);
          return blogsecond.likes - blogfirst.likes;
        })
        .map((blog) => (
          <li key={blog.id}>
            <Link
              to={`/notes/${blog.id}`}
            >{`${blog.title} ${blog.author}`}</Link>
          </li>
        ))}
    </ul>
  );
}

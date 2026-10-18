import blogService from "../services/blogs";
import { useNavigate, useParams } from "react-router-dom";
const Blog = ({ setBlogs, blogs, user, setSuccessMessage }) => {
  const id = useParams().id;
  const blog = blogs.find((blog) => blog.id === id);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  const navigate = useNavigate();
  const addLike = async (blog) => {
    if (!user) return;
    try {
      blog.likes += 1;
      const updatedBlog = await blogService.add(blog);
      setBlogs(
        blogs.map((blog) => {
          if (blog.id === updatedBlog.id) return updatedBlog;
          return blog;
        }),
      );
    } catch (exception) {
      console.log(exception);
    }
  };

  const deleteBlog = async (selectedBlog) => {
    if (!user) return;
    const deleteConfrimation = window.confirm(
      `Remove blog ${selectedBlog.title} by ${selectedBlog.author}`,
    );
    if (!deleteConfrimation) return;

    try {
      console.log(selectedBlog);
      const response = await blogService.remove(selectedBlog.id);
      if (response == 204) {
        setBlogs(blogs.filter((blog) => blog.id != selectedBlog.id));
        setSuccessMessage(null);
        navigate("/");
      } else throw new Error(`Wrong response code ${response}`);
    } catch (exception) {
      console.log(exception);
    }
  };
  console.log(user);
  return (
    <li className="blog">
      <div style={blogStyle}>
        <p>{`${blog.title} ${blog.author}`}</p>
        <p className="url">{blog.url}</p>
        {user && (
          <p className="likes">
            likes {blog.likes}
            <button onClick={() => addLike(blog)}>like</button>
          </p>
        )}
        <p>{blog.user}</p>
        {user && user.username === blog.user && (
          <button onClick={() => deleteBlog(blog)}>remove</button>
        )}
      </div>
    </li>
  );
};

export default Blog;

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Bloglist from "./components/Bloglist";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import LoginForm from "./components/LoginForm";
import AddBlogForm from "./components/AddBlogForm";
import Togglable from "./components/Togglable";
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(() => {
    const userLoggedJSON = window.localStorage.getItem("bloglistUser");
    if (userLoggedJSON) return JSON.parse(userLoggedJSON);
    return null;
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) blogService.setToken(user.token);
  }, [user]);
  console.log(user);

  // useEffect(() => {
  //   const fetchBlogs = async () => {
  //     const userLoggedJSON = window.localStorage.getItem("bloglistUser");
  //     if (userLoggedJSON) {
  //       const blogs = await blogService.getAll();
  //       setBlogs(blogs);
  //       console.log("mpainei sto effect");
  //     }
  //   };
  //   fetchBlogs();
  // }, []);
  useEffect(() => {
    const fetchBlogs = async () => {
      console.log("run");
      const blogs = await blogService.getAll();
      setBlogs(blogs);
    };
    fetchBlogs();
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("bloglistUser");
    setUser(null);
    navigate("/");
  };

  const addBlog = async (blogObject) => {
    try {
      const blogNew = await blogService.create(blogObject);
      setBlogs([...blogs, blogNew]);

      setSuccessMessage(
        `a new blog ${blogObject.title} by ${blogObject.author} added`,
      );
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (exception) {
      console.log(exception);
    }
  };

  return (
    <>
      <div>
        <Link to="/">blogs</Link>
        {user ? (
          <>
            <Link to="/create">create</Link>
            <button onClick={handleLogout}>logout</button>
          </>
        ) : (
          <Link to="/login">login</Link>
        )}
      </div>
      <Routes>
        <Route
          path="/notes/:id"
          element={
            <Blog
              user={user}
              blogs={blogs}
              setBlogs={setBlogs}
              setSuccessMessage={setSuccessMessage}
            ></Blog>
          }
        />
        <Route
          path="/create"
          element={
            <Togglable buttonLabel="create new blog">
              <AddBlogForm addBlog={addBlog} />
            </Togglable>
          }
        />
        <Route
          path="/"
          element={
            <>
              <h2>blogs</h2>
              {user ? <p>{user.username} logged in</p> : ""}
              <Bloglist
                blogs={blogs}
                user={user}
                setBlogs={setBlogs}
                setSuccessMessage={setSuccessMessage}
              ></Bloglist>
            </>
          }
        />
        <Route
          path="/login"
          element={
            <div>
              {errorMessage && (
                <p style={{ color: "red", borderColor: "red" }}>
                  {errorMessage}
                </p>
              )}
              {successMessage && (
                <p style={{ color: "green", borderColor: "green" }}>
                  {successMessage}
                </p>
              )}
              {!user && (
                <LoginForm
                  setUser={setUser}
                  setBlogs={setBlogs}
                  setErrorMessage={setErrorMessage}
                ></LoginForm>
              )}
            </div>
          }
        />
      </Routes>
    </>
  );
};

export default App;

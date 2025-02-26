import axios, { CanceledError } from "axios";
import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
}

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);

    axios
      .get<User[]>("https://jsonplaceholder.typicode.com/users", {
        signal: controller.signal,
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const deleteUser = (user: User) => {
    const originalUsers = [...users];

    setUsers(users.filter((u) => u.id !== user.id));

    axios
      .delete(`https://jsonplaceholder.typicode.com/users/${user.id}`)
      .catch((err) => {
        setError(err.message);
        setUsers(originalUsers);
      });
  };

  useEffect(() => {
    console.log("Updated Users:", users);
  }, [users]);

  const addUser = () => {
    const originalUsers = [...users];

    // Create a temporary user
    const newUser = { id: 0, name: "Paul" };
    setUsers((prevUsers) => [newUser, ...prevUsers]);

    axios
      .post(`https://jsonplaceholder.typicode.com/users`, newUser)
      .then(({ data: savedUser }) => {
        // Replace temporary user with the real one from the server
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === 0 ? savedUser : user))
        );
      })
      .catch((err) => {
        setError(err.message);
        setUsers(originalUsers); // Revert to original state on error
      });
  };

  return (
    <>
      {error && <p className="text-danger">{error}</p>}
      {isLoading && <div className="spinner-border"></div>}
      <button className="btn btn-primary mb" onClick={addUser}>
        Add
      </button>

      <ul className="list-group">
        {users.map((user) => {
          return (
            <li
              key={user.id}
              className="list-group-item d-flex justify-content-between"
            >
              {user.name}
              <button
                className="btn btn-outline-danger"
                onClick={() => deleteUser(user)}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default App;

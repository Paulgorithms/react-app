import { useEffect, useState } from "react";
import { CanceledError } from "./services/api-client";
import userService, { User } from "./services/user-service";

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);

    const { request, cancel } = userService.getAllUsers();
    request
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });
    return () => cancel();
  }, []);

  const updateUser = (user: User) => {
    const originalUsers = [...users];

    const updatedUser = { ...user, name: user.name + `!` };

    setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));

    userService.updateUser(updatedUser).catch((err) => {
      setError(err.message);
      setUsers(originalUsers);
    });
  };

  const deleteUser = (user: User) => {
    const originalUsers = [...users];

    setUsers(users.filter((u) => u.id !== user.id));

    userService.deleteUser(user.id).catch((err) => {
      setError(err.message);
      setUsers(originalUsers);
    });
  };

  useEffect(() => {
    console.log("Updated Users:", users);
  }, [users]);

  const addUser = () => {
    const originalUsers = [...users];
    const newUser = { id: 0, name: "Paul" };

    setUsers((prevUsers) => [newUser, ...prevUsers]);

    userService
      .createUser(newUser)
      .then(({ data: savedUser }) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === 0 ? savedUser : user))
        );
      })
      .catch((err) => {
        setError(err.message);
        setUsers(originalUsers);
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
              <div>
                <button
                  className="btn btn-outline-secondary mx-1"
                  onClick={() => updateUser(user)}
                >
                  Update
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => deleteUser(user)}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default App;

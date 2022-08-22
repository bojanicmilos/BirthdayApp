import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    test()
  }, [])

  const test = async () => {
    const response = await fetch('http://localhost:3000/api/users/upcomingbirthdays')
    const json = await response.json()
    setUsers(json.paginatedResults)
  }

  return (
    <>
      {
        users.map((user) => {
          return (
            <div>{user.name}</div>
          )
        })
      }
    </>
  );
}

export default App;

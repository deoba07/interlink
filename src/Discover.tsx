import { useState } from "react";

function Discover() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(
      `https://backlink-6l9m.onrender.com/internships/search?q=${search}`
    );

    const data = await res.json();
    setResults(data);
  };

  return (
    <div>
      <h1>Discover Internships</h1>

      <form onSubmit={handleSearch}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search internships..."
        />
        <button type="submit">Search</button>
      </form>

      <div>
        {results.map((item: any) => (
          <div key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.location}</p>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Discover;
import * as React from 'react';

var csvAPI =
  'https://raw.githubusercontent.com/ph4un00b/data/main/1000movies.csv';

export default function SearchApp() {
  var [titles, setTitles] = React.useState<{ key: string; title: string }[]>([
    { key: '', title: '' },
  ]);
  var [query, setQuery] = React.useState<string>('');

  React.useEffect(() => {
    fetchData();

    async function fetchData() {
      const res = await fetch(csvAPI);

      if (!res.ok) return;
      const data = await res.text();

      const [, ...movies] = data.split('\n').map((movie) => {
        const [movieKey] = movie.split(',');

        if (movie.indexOf('"') == -1) {
          const [, title] = movie.split(',');
          return { key: movieKey, title };
        }

        // https://www.designcise.com/web/tutorial/how-to-return-the-position-of-a-regular-expression-match-in-javascript

        /* + 1 id for double quote ["] adjusment */
        search_way: {
          const start = 1 + movie.search(/"/);
          const end = start + movie.substring(start).search(/"/);
          var title = movie.substring(start, end);
          // console.log(title);
        }

        match_way: {
          const regex = /"(.+)"/d; // String#match with regex and "g" flag will output the literal match
          const matches = movie.match(regex);
          const [, [start, end]] = matches.indices;
          const title = movie.substring(start, end);
          // console.log(Object.keys(matches), JSON.stringify(matches.indices));
          // console.log(title);
        }

        exec_way: {
          const regex = /"(.+)"/dg;
          const matches = regex.exec(movie);
          const [, [start, end]] = matches.indices;
          const title = movie.substring(start, end);
          // console.log(Object.keys(matches), JSON.stringify(matches.indices));
          // console.log(title);
        }

        es2019_match_all: {
          const regex = /"(.+)"/dg;
          const iterator = movie.matchAll(regex);
          const [matches] = Array.from(iterator);
          const [, [start, end]] = matches.indices;
          const title = movie.substring(start, end);
          // console.log(title);
        }

        return {
          key: movieKey,
          title,
        };
      });

      setTitles(movies);
    }

    return () => {};
  }, []);

  regex_way: {
    const regex = RegExp(query, 'ig');
    const filtered = titles.filter(({ title }) => title.match(regex));
  }

  memoized_way: {
    const filtered = React.useMemo(() => {
      return titles.filter(({ title }) =>
        title.toLowerCase().includes(query.toLowerCase())
      );
    }, [query, titles]);
  }

  common_way: {
    var filtered = titles.filter(({ title }) =>
      title.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (titles.length == 0) return <p>...loading</p>;

  return (
    <div>
      <h3>Titles: {filtered.length}</h3>
      <br />
      <input
        type="text"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(e.target.value);
        }}
        placeholder="search movie"
        value={query}
      />

      <ul>
        {filtered.length > 0 &&
          filtered
            .slice(0, 8)
            .map((movie) => <p key={movie.key}>{movie.title}</p>)}
      </ul>
    </div>
  );
}
